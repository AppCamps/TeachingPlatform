import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Shape as TopicShape } from '../../../models/topic';
import { Shape as CourseShape } from '../../../models/course';

import Course from '../../shared/course';

import style from './style.scss';

class CourseList extends Component {
  courseList() {
    const { topic, courses } = this.props;

    return courses.map((course) => {
      const lessonUrl = ({ lesson }) => `/topics/${topic.slug}/${course.slug}/${lesson.slug}`;
      return (
        <div key={course.id} className={style.courseContainer}>
          <Course course={course} topic={topic} lessonUrl={lessonUrl} />
        </div>
      );
    });
  }

  render() {
    const { t } = this.context;
    const { topic } = this.props;

    return (
      <div>
        {topic.description && <p>{t(topic.description)}</p>}
        <div className={style.courseList} style={{ backgroundColor: topic.lightColor }}>
          {this.courseList()}
        </div>
      </div>
    );
  }
}

CourseList.propTypes = {
  courses: PropTypes.arrayOf(CourseShape).isRequired,
  topic: TopicShape,
};

CourseList.defaultProps = {
  topic: null,
};

CourseList.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CourseList;
