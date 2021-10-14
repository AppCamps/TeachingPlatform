import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes as formPropTypes } from "redux-form";
import autobind from "autobind-decorator";

import { translatedFormError } from "../../../utils/translations";

import Link from "../../shared/link";
import InputWithLabel from "../../shared/input-with-label";
import Button from "../../shared/button";
import Spinner from "../../shared/spinner";

import style from "./style.scss";

class EditUserPassword extends Component {
  @autobind
  onSubmit(formValues) {
    const {
      updateUser,
      user: { id },
      reset,
    } = this.props;
    return updateUser({ ...formValues, id }).then(() => {
      reset();
    });
  }

  editUserForm() {
    const { t } = this.context;
    const { submitting, handleSubmit, pristine, submitSucceeded } = this.props;

    let submitIcon = null;
    let buttonText = t("Save");
    if (submitSucceeded && pristine) {
      submitIcon = "check";
      buttonText = t("Saved");
    }

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div>
          <div className={style.password}>
            <Field
              name="currentPassword"
              type="password"
              label={t("Current password")}
              component={InputWithLabel}
              required
            />
          </div>
          <div className={style.password}>
            <Field
              name="password"
              type="password"
              label={t("New password")}
              component={InputWithLabel}
              required
            />
          </div>
          <div className={style.password}>
            <Field
              name="passwordConfirmation"
              type="password"
              label={t("Confirm new password")}
              component={InputWithLabel}
              required
            />
          </div>
        </div>
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
        <div className={style.editUserPassword}>
          <h1 className={style.heading}>{t("Edit your data")}</h1>
          <div className={style.cancel}>
            <Link to="/">{t("cancel")}</Link>
          </div>
          <div className={style.editUserPasswordForm}>
            <h2>{t("Edit password")}</h2>
            {this.editUserForm()}
          </div>
        </div>
      </div>
    );
  }
}

EditUserPassword.propTypes = {
  ...formPropTypes,
  updateUser: PropTypes.func.isRequired,
};

EditUserPassword.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { password, passwordConfirmation } = values;

  ["currentPassword", "password", "passwordConfirmation"].forEach((key) => {
    if (!values[key]) {
      errors[key] = translatedFormError("required");
    }
  });

  if (password && password.length < 8) {
    errors.password = translatedFormError("minimumCharCount", { min: 8 });
  }

  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = translatedFormError("notEqual");
  }

  return errors;
};

export default reduxForm({
  form: "editUserPasswordForm",
  validate,
})(EditUserPassword);
