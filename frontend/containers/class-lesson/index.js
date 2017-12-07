import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import intersection from 'lodash.intersection';

import {
  fetchClassById,
  markLessonAsComplete,
  markLessonAsIncomplete,
} from '../../actions/classes';
import { fetchCourses } from '../../actions/courses';
import ClassLesson from '../../components/class-lesson';

import {
  lessonBySlugSelector,
  nextLessonBySlugSelector,
  prevLessonBySlugSelector,
  lessonIdsSelector,
} from '../../selectors/shared/lesson';
import { classByIdSelector, completedLessonIdsSelector } from '../../selectors/shared/class';

export function mapStateToProps(state, { params }) {
  const nextLesson = nextLessonBySlugSelector(state, params);
  const prevLesson = prevLessonBySlugSelector(state, params);

  const klass = classByIdSelector(state, params.classId);
  const lesson = lessonBySlugSelector(state, params);

  const lessonIds = lessonIdsSelector(state, params);
  const completedLessonIds = completedLessonIdsSelector(state, params.classId);

  const courseProgress = {
    completedLessons: intersection(lessonIds, completedLessonIds).length,
    totalLessons: lessonIds.length,
  };

  const returnValue = {
    class: klass,
    lesson,
    nextLesson,
    prevLesson,
    courseProgress,
  };
  return returnValue;
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchClassById: id => dispatch(fetchClassById(id)),
    fetchCourses: () => dispatch(fetchCourses()),
    markLessonAsComplete: (klass, lesson) => dispatch(markLessonAsComplete(klass, lesson)),
    markLessonAsIncomplete: (klass, lesson) => dispatch(markLessonAsIncomplete(klass, lesson)),
    handleBackToClasses: () => dispatch(push('/classes')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassLesson);
