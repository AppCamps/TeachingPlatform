import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

import Link from "../shared/link";
import ClassForm, { FormShape } from "../shared/class-form";

import { Shape as TopicShape } from "../../models/topic";

import style from "./style.scss";

class CreateClass extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isSubmitted: false,
    };
  }

  componentWillMount() {
    this.props.fetchCourses();
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () =>
      this.routerWillLeave()
    );
  }

  componentWillUnmount() {
    this.props.destroyForm();
  }

  @autobind
  async handleSubmit(formValues) {
    try {
      // The updateClass promise resolves after the change page action
      // is called. It is necessary to change the state before and
      // revert it if the promise rejects.
      this.setState({
        ...this.state,
        isSubmitted: true,
      });
      await this.props.createClass(formValues);
    } catch (e) {
      // Did not submit successfully
      this.setState({
        ...this.state,
        isSubmitted: true,
      });
    }
  }

  routerWillLeave() {
    const { t } = this.context;

    if (!this.state.isSubmitted && this.props.dirty) {
      return `${t(
        "You did not save your data! Do you still want to leave the page?"
      )}\n${t(
        "(You can save the class in the third step, please scroll down.)"
      )}`;
    }

    return null;
  }

  render() {
    const { t } = this.context;
    const { formValues, topics } = this.props;

    const formProps = {
      formValues,
      topics,
      handleSubmit: this.handleSubmit,
      submitText: t("Create class"),
      editMode: false,
    };

    return (
      <div className={style.container}>
        <div className={style.createClass}>
          <h1 className={style.heading}>{t("Create a new class")}</h1>
          <div className={style.cancel}>
            <Link to="/classes">{t("cancel")}</Link>
          </div>
          <ClassForm {...formProps} />
        </div>
      </div>
    );
  }
}

CreateClass.propTypes = {
  formValues: FormShape,
  dirty: PropTypes.bool,
  createClass: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(TopicShape),
  router: PropTypes.object,
  route: PropTypes.object,
};

CreateClass.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CreateClass;
