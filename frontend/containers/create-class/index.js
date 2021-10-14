import { connect } from "react-redux";
import { destroy, getFormValues } from "redux-form";
import { withRouter } from "react-router";

import Component from "../../components/create-class";
import { topicsSelector } from "../../selectors/shared/topic";
import { createClass } from "../../actions/classes";
import { userSelector } from "../../selectors/shared/user";
import { fetchCourses } from "../../actions/courses";

export function mapStateToProps(state) {
  const formValues = getFormValues("classForm")(state) || {};

  return {
    formValues,
    user: userSelector(state),
    topics: topicsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createClass: (formData) => dispatch(createClass(formData)),
    fetchCourses: () => dispatch(fetchCourses()),
    destroyForm: () => dispatch(destroy("classForm")),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Component));
