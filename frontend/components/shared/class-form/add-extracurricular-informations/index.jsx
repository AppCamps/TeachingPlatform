import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, propTypes as reduxFormPropTypes } from "redux-form";
import autobind from "autobind-decorator";

import { translatedFormError } from "../../../../utils/translations";
import { isInRange } from "../../../../utils/form";
import { constants } from "../../../../config";

import InputWithLabel from "../../input-with-label";
import TextareaWithLabel from "../../textarea-with-label";
import Button from "../../button";

import style from "./style.scss";

class AddExtraCurricularInformations extends Component {
  componentDidMount() {
    const { formValues, change } = this.props;

    if (!formValues.year) {
      const currentYear = new Date().getFullYear().toString();

      change("year", currentYear);
    }
  }

  @autobind
  onChange() {
    const { onDataChanged } = this.props;
    onDataChanged();
  }

  @autobind
  handleBackButtonClick() {
    this.props.previousPage();
  }

  render() {
    const { t } = this.context;

    return (
      <div className={style.addExtracurricularInformations}>
        <form onSubmit={this.props.handleSubmit}>
          <h2>{t("Add information about your class")}</h2>
          <div>
            <div className={style.groupName}>
              <Field
                name="groupName"
                label={t("Group name")}
                component={InputWithLabel}
                onChange={this.onChange}
                autoFocus
                required
              />
            </div>
            <div className={style.year}>
              <Field
                name="year"
                label={t("Year")}
                component={InputWithLabel}
                onChange={this.onChange}
                required
              />
            </div>
            <div className={style.age}>
              <Field
                name="age"
                label={t("Age")}
                component={InputWithLabel}
                onChange={this.onChange}
              />
            </div>
            <div className={style.girlCount}>
              <Field
                name="girlCount"
                label={t("Girl count")}
                normalize={isInRange(0, constants.STUDENT_COUNT_MAX)}
                component={InputWithLabel}
                onChange={this.onChange}
              />
            </div>
            <div className={style.boyCount}>
              <Field
                name="boyCount"
                label={t("Boy count")}
                normalize={isInRange(0, constants.STUDENT_COUNT_MAX)}
                component={InputWithLabel}
                onChange={this.onChange}
              />
            </div>
            <div className={style.plannedExtracurricularUsage}>
              <Field
                name="plannedExtracurricularUsage"
                label={t("In what setting will you teach the courses?")}
                component={TextareaWithLabel}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={style.actions}>
            <div className={style.nextButton}>
              <Button
                isAction
                isFullWidth
                type="submit"
                rightIcon="angle-right"
              >
                {t("Next")}
              </Button>
            </div>
            <div className={style.backButton}>
              <Button
                isSecondary
                isFullWidth
                onClick={this.handleBackButtonClick}
                leftIcon="angle-left"
              >
                {t("Back")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AddExtraCurricularInformations.propTypes = {
  ...reduxFormPropTypes,
  previousPage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDataChanged: PropTypes.func,
};

AddExtraCurricularInformations.contextTypes = {
  t: PropTypes.func.isRequired,
};

AddExtraCurricularInformations.defaultProps = {
  onDataChanged: () => {},
};

export function validate(values) {
  const errors = {};
  const groupName = values.groupName;
  const year = values.year;

  if (!groupName) {
    errors.groupName = translatedFormError("required");
  }
  if (!year) {
    errors.year = translatedFormError("required");
  }
  return errors;
}

export default reduxForm({
  form: "classForm",
  destroyOnUnmount: false,
  validate,
})(AddExtraCurricularInformations);
