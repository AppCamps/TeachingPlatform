import { connect } from 'react-redux';

import { fetchCourses } from '../../actions/courses';
import {
  lessonBySlugSelector,
  nextLessonBySlugSelector,
  prevLessonBySlugSelector,
} from '../../selectors/shared/lesson';

import CourseLesson from '../../components/course-lesson';

export function mapStateToProps(state, { params }) {
  const lesson = lessonBySlugSelector(state, params);
  const nextLesson = nextLessonBySlugSelector(state, params);
  const prevLesson = prevLessonBySlugSelector(state, params);

  return {
    lesson,
    nextLesson,
    prevLesson,
    courseSlug: params.courseSlug,
    topicSlug: params.topicSlug,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchCourses: () => dispatch(fetchCourses()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseLesson);
