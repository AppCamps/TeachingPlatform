import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { fetchCourses as fetchCoursesAction } from '../../actions/courses';
import { courseBySlugSelector } from '../../selectors/shared/course';

export function mapStateToProps(state, { params }) {
  const course = courseBySlugSelector(state, params);

  let topicSlug = null;
  if (course) {
    topicSlug = course.topic.slug;
  }

  return {
    lessonSlug: params.lessonSlug,
    courseSlug: params.courseSlug,
    topicSlug,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchCourses: () => dispatch(fetchCoursesAction()),
    redirect: (topicSlug, courseSlug, lessonSlug) =>
      dispatch(replace(`/topics/${topicSlug}/${courseSlug}/${lessonSlug}`)),
  };
}

export class CourseLessonRedirect extends Component {
  componentWillMount() {
    const { fetchCourses, topicSlug } = this.props;

    if (!topicSlug) {
      fetchCourses();
    }
  }

  componentWillUpdate(nextProps) {
    const { redirect, topicSlug, courseSlug, lessonSlug } = nextProps;

    if (topicSlug) {
      redirect(topicSlug, courseSlug, lessonSlug);
    }
  }

  render() {
    return <div />;
  }
}

CourseLessonRedirect.propTypes = {
  topicSlug: PropTypes.string,
  courseSlug: PropTypes.string.isRequired,
  lessonSlug: PropTypes.string.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
};

CourseLessonRedirect.defaultProps = {
  topicSlug: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseLessonRedirect);
