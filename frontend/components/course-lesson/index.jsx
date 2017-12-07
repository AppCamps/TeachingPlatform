import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Shape as LessonShape } from '../../models/lesson';

import NotFound from '../shared/not-found';
import Link from '../shared/link';
import Lesson from '../shared/lesson';

class CourseLesson extends Component {
  componentDidMount() {
    const { fetchCourses, courseSlug } = this.props;
    fetchCourses(courseSlug);
  }

  lessonActions() {
    const { t } = this.context;
    const { handleBackToCourses, topicSlug } = this.props;

    return (
      <div>
        <Link button to={`/topics/${topicSlug}`} isSecondary leftIcon="angle-left">
          {t('back to course overview')}
        </Link>
      </div>
    );
  }

  render() {
    const { t } = this.context;
    const { lesson, prevLesson, nextLesson, topicSlug } = this.props;
    const lessonUrl = linkedLesson =>
      `/topics/${topicSlug}/${lesson.course.slug}/${linkedLesson.slug}`;

    if (lesson.isPersisted && !lesson.id) {
      return <NotFound />;
    }

    return (
      <Lesson
        lesson={lesson}
        title={t('Course preview')}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        course={lesson.course}
        lessonUrl={lessonUrl}
        lessonActions={this.lessonActions()}
      />
    );
  }
}

CourseLesson.contextTypes = {
  t: PropTypes.func.isRequired,
};

CourseLesson.propTypes = {
  lesson: LessonShape,
  prevLesson: LessonShape,
  nextLesson: LessonShape,
  courseSlug: PropTypes.string.isRequired,
  topicSlug: PropTypes.string.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  handleBackToCourses: PropTypes.func.isRequired,
};

CourseLesson.defaultProps = {
  lesson: null,
  prevLesson: null,
  nextLesson: null,
};

export default CourseLesson;
