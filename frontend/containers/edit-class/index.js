import { connect } from 'react-redux';
import { initialize, destroy, getFormValues } from 'redux-form';
import { withRouter } from 'react-router';

import Component from '../../components/edit-class';
import { updateClass, fetchClassById } from '../../actions/classes';
import { fetchCourses } from '../../actions/courses';

import { classByIdSelector } from '../../selectors/edit-class';
import { topicsSelector } from '../../selectors/shared/topic';

export function mapStateToProps(state, ownProps) {
  const { classId } = ownProps.params;
  const formValues = getFormValues('classForm')(state) || {};

  return {
    formValues,
    klass: classByIdSelector(state, classId),
    topics: topicsSelector(state),
  };
}

function sanitizeInitialFormData(klass) {
  const values = { ...klass };
  delete values.completedLessons;
  delete values.isPersisted;
  return values;
}

function mapDispatchToProps(dispatch) {
  return {
    fetchClassById: id => dispatch(fetchClassById(id)),
    fetchCourses: () => dispatch(fetchCourses()),
    updateClass: (id, formData) => dispatch(updateClass(id, formData)),
    initializeForm: klass => dispatch(initialize('classForm', sanitizeInitialFormData(klass), true)),
    destroyForm: () => dispatch(destroy('classForm')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Component));
