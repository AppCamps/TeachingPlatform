import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import classNames from "classnames";

import ChooseClassTypeComponent from "./choose-class-type";
import AddClassInformationsComponent from "./add-class-informations";
import AddExtracurricularInformationsComponent from "./add-extracurricular-informations";
import AddCoursesComponent from "./add-courses";

import { Shape as TopicShape } from "../../../models/topic";

import FaIcon from "../fa-icon";
import Button from "../button";

import style from "./style.scss";

class ClassForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  @autobind
  setPage(page) {
    this.setState({ page });
  }

  @autobind
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  @autobind
  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  async handleSubmit(...args) {
    try {
      await this.props.handleSubmit(...args);
    } catch (e) {
      // Validation error?
      this.setPage(2);
      // Propagate error?
      // throw e;
    }
  }

  stepClassNames(stepNumber) {
    const isCurrentStep = stepNumber === this.state.page;
    const isPastStep = stepNumber < this.state.page;
    const { editMode } = this.props;

    return classNames({
      [`${style.progressBarStep}`]: true,
      [`${style.progressBarStepActive}`]: isCurrentStep,
      [`${style.progressBarStepDone}`]: isPastStep,
      [`${style.clickable}`]: editMode,
    });
  }

  renderTab(page, title) {
    const { t } = this.context;
    const { editMode } = this.props;
    const changePage = editMode ? () => this.setPage(page) : undefined;

    return (
      <Button
        key={page}
        className={this.stepClassNames(page)}
        onClick={changePage}
      >
        <span className={style.doneIcon}>
          <FaIcon icon="check" />
        </span>
        <span className={style.number}>{page}</span>
        {t(title)}
      </Button>
    );
  }

  renderTabs() {
    const { t } = this.context;

    const tabs = [
      { page: 1, title: t("Choose class type") },
      { page: 2, title: t("Add class information") },
      { page: 3, title: t("Choose courses") },
    ];

    return (
      <div>{tabs.map(({ page, title }) => this.renderTab(page, title))}</div>
    );
  }

  renderFormPage() {
    const { page } = this.state;
    const { formValues, onDataChanged } = this.props;
    const handleSubmit = (...args) => this.handleSubmit(...args);

    switch (page) {
      case 2:
        if (formValues.resourceType === "extracurricular") {
          return (
            <AddExtracurricularInformationsComponent
              previousPage={this.previousPage}
              onSubmit={this.nextPage}
              onDataChanged={onDataChanged}
              formValues={formValues}
            />
          );
        }
        return (
          <AddClassInformationsComponent
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onDataChanged={onDataChanged}
            formValues={formValues}
          />
        );

      case 3:
        return (
          <AddCoursesComponent
            formValues={this.props.formValues}
            topics={this.props.topics}
            previousPage={this.previousPage}
            onSubmit={handleSubmit}
            onDataChanged={onDataChanged}
            submitText={this.props.submitText}
          />
        );

      default:
        return (
          <ChooseClassTypeComponent
            formValues={this.props.formValues}
            onSubmit={this.nextPage}
            onDataChanged={onDataChanged}
          />
        );
    }
  }

  render() {
    return (
      <div>
        {this.renderTabs()}
        <div className={style.form}>{this.renderFormPage()}</div>
      </div>
    );
  }
}

const FormShape = PropTypes.shape({
  resourceType: PropTypes.oneOf(["school_class", "extracurricular"]),
  className: PropTypes.string,
  schoolYear: PropTypes.string,
  grade: PropTypes.string,
  girlCount: PropTypes.string,
  boyCount: PropTypes.string,
  plannedSchoolUsage: PropTypes.string,
  schoolSubject: PropTypes.string,
  groupName: PropTypes.string,
  year: PropTypes.string,
  age: PropTypes.string,
  plannedExtracurricularUsage: PropTypes.string,
  courses: PropTypes.arrayOf(PropTypes.string),
});

ClassForm.propTypes = {
  editMode: PropTypes.bool.isRequired,
  formValues: FormShape.isRequired,
  topics: PropTypes.arrayOf(TopicShape),
  handleSubmit: PropTypes.func.isRequired,
  onDataChanged: PropTypes.func,
  submitText: PropTypes.string.isRequired,
};

ClassForm.contextTypes = {
  t: PropTypes.func.isRequired,
};

ClassForm.defaultProps = {
  onDataChanged: () => {},
};

export default ClassForm;
export { FormShape };
