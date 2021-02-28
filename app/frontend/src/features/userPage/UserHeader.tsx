import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";

import Avatar from "../../components/Avatar";
import ScoreBar from "../../components/Bar/ScoreBar";
import { CouchIcon } from "../../components/Icons";
import IconText from "../../components/IconText";
import PageTitle from "../../components/PageTitle";
import { User } from "../../pb/api_pb";
import { timestamp2Date } from "../../utils/date";
import { timeAgo } from "../../utils/timeAgo";
import { COMMUNITY_STANDING } from "../constants";
import { hostingStatusLabels } from "../profile/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    maxWidth: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  name: {
    marginBottom: theme.spacing(1),
  },
  editButton: {
    marginBottom: theme.spacing(2),
  },
}));

interface UserHeaderProps {
  children?: React.ReactNode;
  user: User.AsObject;
}

export default function UserHeader({ children, user }: UserHeaderProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.avatar}>
        <Avatar grow user={user} isProfileLink={false} />
      </div>
      <PageTitle className={classes.name}>{user.name}</PageTitle>

      <IconText
        icon={CouchIcon}
        text={hostingStatusLabels.get(user.hostingStatus)}
      />

      {user.lastActive && (
        <Box mb={2}>
          <Typography component="p" variant="caption" gutterBottom>
            {timeAgo(timestamp2Date(user.lastActive), true)}
          </Typography>
        </Box>
      )}

      {children}

      <ScoreBar value={user.communityStanding * 100}>
        {COMMUNITY_STANDING}
      </ScoreBar>
      <ScoreBar value={user.verification * 100}>Verification Score</ScoreBar>
    </div>
  );
}
