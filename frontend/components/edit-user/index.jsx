import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes as formPropTypes } from "redux-form";
import autobind from "autobind-decorator";

import { translatedFormError } from "../../utils/translations";

import Link from "../shared/link";
import InputWithLabel from "../shared/input-with-label";
import Button from "../shared/button";
import Spinner from "../shared/spinner";

import style from "./style.scss";

class EditUser extends Component {
  @autobind
  onSubmit(formValues) {
    const {
      updateUser,
      user: { id },
      initialize,
    } = this.props;
    return updateUser({ ...formValues, id }).then(() => {
      initialize({ ...formValues });
    });
  }

  @autobind
  handleEmailConfirmationRequestLinkClick() {
    const {
      emailConfirmationRequest,
      user: { unconfirmedEmail },
    } = this.props;
    return emailConfirmationRequest({ email: unconfirmedEmail });
  }

  editUserForm() {
    const { t } = this.context;
    const { submitting, handleSubmit, user, pristine, submitSucceeded } =
      this.props;

    let unconfirmedInfo = null;
    if (user.unconfirmedEmail) {
      unconfirmedInfo = t(
        "{email} is still unconfirmed. {emailConfirmationRequestLink}",
        {
          email: <b>{user.unconfirmedEmail}</b>,
          emailConfirmationRequestLink: (
            <a
              tabIndex="0"
              onClick={this.handleEmailConfirmationRequestLinkClick}
            >
              {t("Resend confirmation link")}
            </a>
          ),
        }
      );
    }

    let submitIcon = null;
    let buttonText = t("Save");
    if (submitSucceeded && pristine) {
      submitIcon = "check";
      buttonText = t("Saved");
    }

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div>
          <div className={style.email}>
            <Field
              name="email"
              label={t("Email")}
              component={InputWithLabel}
              required
            />
          </div>
          <div className={style.firstName}>
            <Field
              name="firstName"
              label={t("First name")}
              component={InputWithLabel}
              required
            />
          </div>
          <div className={style.lastName}>
            <Field
              name="lastName"
              label={t("Last name")}
              component={InputWithLabel}
              required
            />
          </div>
        </div>
        <div className={style.unconfirmed}>{unconfirmedInfo}</div>
        <div className={style.actions}>
          <Spinner visible={submitting} />
          <Button
            isAction
            disabled={submitting}
            type="submit"
            leftIcon={submitIcon}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    );
  }

  render() {
    const { t } = this.context;

    return (
      <div className={style.container}>
        <div className={style.editUser}>
          <h1 className={style.heading}>{t("Edit your data")}</h1>
          <div className={style.cancel}>
            <Link to="/">{t("cancel")}</Link>
          </div>
          <div className={style.editUserForm}>
            <h2>{t("Edit user information")}</h2>
            {this.editUserForm()}
          </div>
        </div>
      </div>
    );
  }
}

EditUser.propTypes = {
  ...formPropTypes,
  updateUser: PropTypes.func.isRequired,
};

EditUser.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { email } = values;

  ["firstName", "lastName", "email"].forEach((key) => {
    if (!values[key]) {
      errors[key] = translatedFormError("required");
    }
  });

  if (email && !email.match(/\S+@\S+\.\S+/)) {
    errors.email = translatedFormError("notAnEmail");
  }

  return errors;
};

export default reduxForm({
  form: "editUserForm",
  validate,
})(EditUser);
