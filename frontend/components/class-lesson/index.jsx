import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import { Shape as ClassShape } from '../../models/class';
import { Shape as LessonShape } from '../../models/lesson';

import NotFound from '../shared/not-found';
import Button from '../shared/button';
import Lesson from '../shared/lesson';
import Spinner from '../shared/spinner';

import style from './style.scss';

class ClassLesson extends Component {
  constructor() {
    super();
    this.state = {
      fetchingCompleteLesson: false,
      fetchingIncompleteLesson: false,
    };
  }

  componentDidMount() {
    const { fetchClassById, fetchCourses } = this.props;
    fetchCourses();
    const klass = this.props.class;
    fetchClassById(klass.id);
  }

  showSpinner(key, action) {
    this.setState({ [`${key}`]: true });
    const setFalse = () => this.setState({ [`${key}`]: false });
    action()
      .then(setFalse)
      .catch(setFalse);
  }

  @autobind
  handleCompleteLessonClicked() {
    const { lesson, markLessonAsComplete } = this.props;
    const klass = this.props.class;

    this.showSpinner('fetchingCompleteLesson', () => markLessonAsComplete(klass, lesson));
  }

  @autobind
  handleIncompleteLessonClicked() {
    if (this.state.fetchingIncompleteLesson) {
      return;
    }

    const { lesson, markLessonAsIncomplete } = this.props;
    const klass = this.props.class;

    this.showSpinner('fetchingIncompleteLesson', () => markLessonAsIncomplete(klass, lesson));
  }

  toggleLessonButtons() {
    const { t } = this.context;
    const { lesson } = this.props;
    const klass = this.props.class;

    if (!lesson.id || !klass.completedLessons) {
      return null;
    }

    if (klass.completedLessons.includes(lesson.id)) {
      return (
        <div className={style.completedLesson}>
          <div>{t('This lesson was tagged as completed.')}</div>
          <div>
            <a
              onClick={this.handleIncompleteLessonClicked}
              className={style.incompleteLink}
              tabIndex="0"
            >
              {t('Undo')}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={style.completeLessonButton}>
        <span className={style.spinner}>
          <Spinner visible={this.state.fetchingCompleteLesson} />
        </span>
        <Button
          onClick={this.handleCompleteLessonClicked}
          isAction
          leftIcon="check"
          disabled={this.state.isFetching}
        >
          {t('Tag lesson as completed')}
        </Button>
      </div>
    );
  }

  lessonActions() {
    const { t } = this.context;
    const { handleBackToClasses } = this.props;

    return (
      <div>
        <div className={style.backButton}>
          <Button onClick={handleBackToClasses} isSecondary leftIcon="angle-left">
            {t('back to my classes')}
          </Button>
        </div>
        {this.toggleLessonButtons()}
      </div>
    );
  }

  render() {
    const { lesson, lesson: { course }, nextLesson, prevLesson, courseProgress } = this.props;
    const klass = this.props.class;
    const lessonUrl = linkedLesson => `/classes/${klass.id}/${course.slug}/${linkedLesson.slug}`;

    const records = [klass, lesson];

    if (records.some(record => record.isPersisted) && records.some(record => !record.id)) {
      return <NotFound />;
    }

    return (
      <Lesson
        lesson={lesson}
        title={klass.title}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        lessonUrl={lessonUrl}
        course={lesson.course}
        lessonActions={this.lessonActions()}
        courseProgress={courseProgress}
      />
    );
  }
}

ClassLesson.contextTypes = {
  t: PropTypes.func.isRequired,
};

ClassLesson.propTypes = {
  class: ClassShape,
  lesson: LessonShape,
  prevLesson: LessonShape,
  nextLesson: LessonShape,
  courseProgress: PropTypes.shape({
    completedLessons: PropTypes.number,
    totalLessons: PropTypes.number,
  }),
  fetchClassById: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  handleBackToClasses: PropTypes.func.isRequired,
  markLessonAsComplete: PropTypes.func.isRequired,
  markLessonAsIncomplete: PropTypes.func.isRequired,
};

export default ClassLesson;
