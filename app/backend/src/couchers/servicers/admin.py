import logging

import grpc
from geoalchemy2.types import Geometry
from google.protobuf import empty_pb2
from google.protobuf.descriptor import Error
from shapely.geometry.geo import shape

from couchers import errors
from couchers.db import session_scope
from couchers.helpers.clusters import create_cluster, create_node
from couchers.models import User
from couchers.servicers.communities import community_to_pb
from proto import admin_pb2, admin_pb2_grpc

logger = logging.getLogger(__name__)


class Admin(admin_pb2_grpc.AdminServicer):
    def GetUserEmailById(self, request, context):
        with session_scope() as session:
            user = session.query(User).filter(User.id == request.user_id).one()
            return admin_pb2.GetUserEmailResponse(user_id=user.id, email=user.email)

    def GetUserEmailByUserName(self, request, context):
        with session_scope() as session:
            user = session.query(User).filter(User.username == request.username).one()
            return admin_pb2.GetUserEmailResponse(user_id=user.id, email=user.email)

    def CreateCommunity(self, request, context):
        try:
            geom = shape(request.geojson)
            assert geom.type == "MULTIPOLYGON"
            node = create_node(geom, request.parent_node_id)
        except Error as e:
            logging.error(f"Error occured while parsing geojson for creating community: {e}")
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, errors.INVALID_MULTIPOLYGON)
        else:
            create_cluster(
                node.id, request.name, request.description, context.user_id, request.admin_ids, [], True
            )
            return community_to_pb(node, context)

    def BlockUser(self, request, context):
        with session_scope() as session:
            user = session.query(User).filter(User.id == request.user_id).one()
            user.is_banned = True
            session.add(user)
            session.commit()
            return empty_pb2.Empty()

    def DeleteUser(self, request, context):
        with session_scope() as session:
            user = session.query(User).filter(User.id == request.user_id).one()
            user.is_deleted = True
            session.add(user)
            session.commit()
            return empty_pb2.Empty()