import { replace } from "react-router-redux";
import { SubmissionError } from "redux-form";

import {
  emailConfirmation as emailConfirmationApiCall,
  emailConfirmationRequest as emailConfirmationRequestApiCall,
} from "../services/api";
import { requestNotification } from "./notifications";
import { t as translate } from "../utils/translations";
import { notifications } from "../config";

const t = (str) => str;
const emailConfirmationInfo = t(
  "If the email is registered with App Camps and not confirmed yet you will soon receive a link to confirm it."
);

const emailConfirmationSuccess = t(
  "Email confirmed. You may now login using your email and password."
);
const emailConfirmationFailureInvalid = t(
  "The confirmation of your email address was not successful. Please, contact us via orga@appcamps.de so that we can confirm your account."
);
const emailConfirmationFailureExpired = t(
  "Your confirmation link has expired. Please restart the confirmation process."
);

export function emailConfirmationRequest({ email }) {
  return (dispatch) =>
    emailConfirmationRequestApiCall({ email }).then(() => {
      dispatch(
        requestNotification({
          type: notifications.success,
          text: translate(emailConfirmationInfo),
        })
      );
    });
}

export function emailConfirmation(confirmationToken) {
  return (dispatch) =>
    emailConfirmationApiCall(confirmationToken)
      .then(() => {
        dispatch(replace("/"));
        dispatch(
          requestNotification({
            type: notifications.success,
            text: translate(emailConfirmationSuccess),
          })
        );
      })
      .catch((error) => {
        if (error instanceof SubmissionError) {
          if (error.errors.confirmationToken || error.errors.email) {
            dispatch(replace("/email-confirmation"));

            let errorMessage = t(emailConfirmationFailureInvalid);
            if (
              error.errors.confirmationToken ===
              "has expired, please request a new one"
            ) {
              errorMessage = t(emailConfirmationFailureExpired);
            }
            dispatch(
              requestNotification({
                type: notifications.failure,
                text: translate(errorMessage),
                // Show for 15 seconds
                displayTime: 15 * 1000,
                hideOnLocationChange: true,
              })
            );
            return;
          }
        }
        throw error;
      });
}
