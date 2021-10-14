import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, propTypes as reduxFormPropTypes } from "redux-form";
import autobind from "autobind-decorator";

import { translatedFormError } from "../../../../utils/translations";
import { isInRange } from "../../../../utils/form";
import { constants } from "../../../../config";

import InputWithLabel from "../../input-with-label";
import SelectWithLabel from "../../select-with-label";
import Button from "../../button";

import style from "./style.scss";

const MONTH_AUGUST = 7; // JS month ranges from 0 - 11

class AddClassInformationsComponent extends Component {
  componentDidMount() {
    const { formValues, change } = this.props;

    if (!formValues.schoolYear) {
      /**
       * A school year is usually from Sept. until July.
       * E.g. if current date is 03/2017, then the current
       * school year should be 2016/2107
       * */
      const now = new Date();
      const currentMonth = now.getMonth();
      let currentYear = now.getFullYear();

      if (currentMonth < MONTH_AUGUST) {
        currentYear -= 1;
      }

      const schoolYear = `${currentYear} / ${currentYear + 1}`;

      change("schoolYear", schoolYear);
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

  plannedSchoolUsageOptions() {
    const { t } = this.context;
    return [
      { value: "lesson_duty", label: t("In a lesson (duty)") },
      { value: "lesson_choice", label: t("In a lesson (choice)") },
      { value: "project_group", label: t("With a project group") },
      { value: "project_days", label: t("On project days") },
    ];
  }

  schoolSubjectLabel() {
    const { t } = this.context;
    const plannedSchoolUsage = this.props.formValues.plannedSchoolUsage;

    if (plannedSchoolUsage === "project_group") {
      return t("In which project group will you use the materials?");
    } else if (plannedSchoolUsage === "project_days") {
      return t("In what kind of project will you use the materials?");
    }
    return t("In which school subject will you use the materials?");
  }

  render() {
    const { t } = this.context;

    return (
      <div className={style.addClassInformations}>
        <form onSubmit={this.props.handleSubmit}>
          <h2>{t("Add information about your class")}</h2>
          <div>
            <div className={style.className}>
              <Field
                name="className"
                label={t("Class name")}
                component={InputWithLabel}
                onChange={this.onChange}
                autoFocus
                required
              />
            </div>
            <div className={style.schoolYear}>
              <Field
                name="schoolYear"
                label={t("School year")}
                component={InputWithLabel}
                onChange={this.onChange}
                required
              />
            </div>
            <div className={style.grade}>
              <Field
                name="grade"
                label={t("Grade")}
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
                min={0}
              />
            </div>
            <div className={style.boyCount}>
              <Field
                name="boyCount"
                label={t("Boy count")}
                normalize={isInRange(0, constants.STUDENT_COUNT_MAX)}
                component={InputWithLabel}
                onChange={this.onChange}
                min={0}
              />
            </div>
            <div className={style.plannedSchoolUsage}>
              <Field
                name="plannedSchoolUsage"
                label={t("Where will you use the materials?")}
                selectProps={{
                  options: this.plannedSchoolUsageOptions(),
                  onBlurResetsInput: false,
                }}
                component={SelectWithLabel}
                onChange={this.onChange}
              />
            </div>
            <div className={style.schoolSubject}>
              <Field
                name="schoolSubject"
                label={this.schoolSubjectLabel()}
                component={InputWithLabel}
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

AddClassInformationsComponent.propTypes = {
  ...reduxFormPropTypes,
  previousPage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDataChanged: PropTypes.func,
};

AddClassInformationsComponent.contextTypes = {
  t: PropTypes.func.isRequired,
};

AddClassInformationsComponent.defaultProps = {
  onDataChanged: () => {},
};

export function validate(values) {
  const errors = {};
  const className = values.className;
  const schoolYear = values.schoolYear;

  if (!className) {
    errors.className = translatedFormError("required");
  }
  if (!schoolYear) {
    errors.schoolYear = translatedFormError("required");
  }
  return errors;
}

export default reduxForm({
  form: "classForm",
  destroyOnUnmount: false,
  validate,
})(AddClassInformationsComponent);
