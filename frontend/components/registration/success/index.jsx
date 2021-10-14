import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

import { constants } from "../../../config";

import CheckSVG from "./check";

import style from "./style.scss";

function RegistrationSuccess(props, context) {
  const { t } = context;
  const { firstName, redirectToRegistrationPage } = props;
  const signInPath = "/login";
  const { SUPPORT_EMAIL } = constants;
  const resendConfirmationUrl = "/email-confirmation";
  const supportEmailUrl = `mailto:${SUPPORT_EMAIL}`;

  if (!firstName) {
    redirectToRegistrationPage();
    return null;
  }

  return (
    <div className={style.container}>
      <div className={style.registration}>
        <h1 className={style.heading}>{t("Registration success")}</h1>
        <div className={style.signInLink}>
          <Link to={signInPath}>{t("Sign in")}</Link>
        </div>
        <div className={style.registrationSuccess}>
          <div className={style.registrationIcon}>
            <CheckSVG />
          </div>
          <div className={style.confirmationInfo}>
            <h2>{t("Welcome to App Camps, {firstName}!", { firstName })}</h2>
            <p>
              {t(
                "You will soon receive an confirmation email. To complete your registration, please click on the confirmation link in the email. Afterwards you will be able to sign in."
              )}
            </p>
            <p>
              {t(
                "If the email does not arrive within the next minutes please {resendConfirmationLink} it or {supportEmailLink}.",
                {
                  supportEmailLink: (
                    <a href={supportEmailUrl}>{t("send us an email")}</a>
                  ),
                  resendConfirmationLink: (
                    <a href={resendConfirmationUrl}>
                      {t("click here to resend")}
                    </a>
                  ),
                }
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

RegistrationSuccess.propTypes = {
  firstName: PropTypes.string.isRequired,
  redirectToRegistrationPage: PropTypes.func.isRequired,
};

RegistrationSuccess.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default RegistrationSuccess;
