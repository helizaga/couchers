import { Alert } from "@material-ui/lab";
import {
  INVALID_STEP,
  RATING_STEP,
  REFERENCE_STEP,
  SUBMIT_STEP,
} from "features/profile/constants";
import Appropriate from "features/profile/view/leaveReference/formSteps/Appropriate";
import Rating from "features/profile/view/leaveReference/formSteps/Rating";
import SubmitReference from "features/profile/view/leaveReference/formSteps/submit/SubmitReference";
import Text from "features/profile/view/leaveReference/formSteps/Text";
import { User } from "pb/api_pb";
import { ReferenceType } from "pb/references_pb";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { leaveReferenceBaseRoute, referenceTypeRoute } from "routes";
import makeStyles from "utils/makeStyles";

export const useReferenceStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: theme.spacing(1),
  },
  card: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  form: {
    marginBottom: theme.spacing(2),
  },
  text: {
    "& > .MuiInputBase-root": {
      width: "100%",
    },
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      "& > .MuiInputBase-root": {
        width: 400,
      },
    },
  },
}));

export type ReferenceContextFormData = {
  text: string;
  wasAppropriate: string;
  rating: number;
};

export type ReferenceFormInputs = {
  text: string;
  wasAppropriate: boolean;
  rating: number;
};

export interface ReferenceStepProps {
  user: User.AsObject;
  referenceData: ReferenceContextFormData;
  setReferenceValues: (values: ReferenceContextFormData) => void;
}

interface ReferenceRouteParams {
  referenceType: string;
  userId: string;
  hostRequest?: string;
  step?: string;
}

export interface ReferenceFormProps {
  user: User.AsObject;
}

export default function ReferenceForm({ user }: ReferenceFormProps) {
  const [referenceData, setReferenceData] = useState<ReferenceContextFormData>({
    text: "",
    wasAppropriate: "",
    rating: 0,
  });

  const setReferenceValues = (values: ReferenceContextFormData) => {
    setReferenceData((prevData) => ({
      ...prevData,
      ...values,
    }));
  };

  const friendMatch = useRouteMatch<ReferenceRouteParams>({
    path: `${leaveReferenceBaseRoute}/:referenceType/:userId/:step?`,
  });
  const hostingMatch = useRouteMatch<ReferenceRouteParams>({
    path: `${leaveReferenceBaseRoute}/:referenceType/:userId/:hostRequestId/:step?`,
  });

  const step =
    friendMatch?.params.referenceType ===
    referenceTypeRoute[ReferenceType.REFERENCE_TYPE_FRIEND]
      ? friendMatch?.params.step
      : hostingMatch?.params.step;

  return step === undefined ? (
    <Appropriate
      user={user}
      referenceData={referenceData}
      setReferenceValues={setReferenceValues}
    />
  ) : step === `${RATING_STEP}` ? (
    <Rating
      user={user}
      referenceData={referenceData}
      setReferenceValues={setReferenceValues}
    />
  ) : step === `${REFERENCE_STEP}` ? (
    <Text
      user={user}
      referenceData={referenceData}
      setReferenceValues={setReferenceValues}
    />
  ) : step === `${SUBMIT_STEP}` ? (
    <SubmitReference user={user} referenceData={referenceData} />
  ) : (
    <Alert severity="error">{INVALID_STEP}</Alert>
  );
}
