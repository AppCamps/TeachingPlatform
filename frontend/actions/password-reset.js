import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";

import {
  passwordResetRequest as passwordResetRequestApiCall,
  passwordReset as passwordResetApiCall,
} from "../services/api";
import { requestNotification } from "./notifications";
import { t as translate } from "../utils/translations";
import { notifications } from "../config";

const t = (str) => str;
const passwordResetRequestSuccess = t(
  "If the email you provided is registered with App Camps you will soon receive an email containing a link to the reset form."
);

const passwordResetSuccess = t(
  "Password successfully changed. You can now login with your new password."
);
const passwordResetFailureInvalid = t(
  "There was an error with your reset link. Please restart the password recovery process."
);
const passwordResetFailureExpired = t(
  "Your password reset link has expired. Please restart the password recovery process."
);

export function passwordResetRequest(user) {
  return (dispatch) =>
    passwordResetRequestApiCall(user).then(() => {
      dispatch(push("/"));
      dispatch(
        requestNotification({
          type: notifications.success,
          text: translate(passwordResetRequestSuccess),
        })
      );
    });
}

export function passwordReset(formData, passwordResetToken) {
  return (dispatch) =>
    passwordResetApiCall(formData, passwordResetToken)
      .then(() => {
        dispatch(push("/"));
        dispatch(
          requestNotification({
            type: notifications.success,
            text: translate(passwordResetSuccess),
            hideOnLocationChange: true,
          })
        );
      })
      .catch((error) => {
        if (error instanceof SubmissionError) {
          if (error.errors.resetPasswordToken) {
            dispatch(push("/password-reset"));

            let errorMessage = t(passwordResetFailureInvalid);
            if (
              error.errors.resetPasswordToken ===
              "has expired, please request a new one"
            ) {
              errorMessage = t(passwordResetFailureExpired);
            }
            dispatch(
              requestNotification({
                type: notifications.failure,
                text: translate(errorMessage),
              })
            );
            return;
          }
        }
        throw error;
      });
}
