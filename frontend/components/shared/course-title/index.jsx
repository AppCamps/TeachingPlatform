import React from 'react';
import PropTypes from 'prop-types';

import { Shape as TopicShape } from '../../../models/topic';
import { Shape as CourseShape } from '../../../models/course';

import style from './style.scss';

function CourseTitle(props) {
  const { course, topic } = props;

  let styles = {};
  if (topic.icon) {
    styles = {
      backgroundImage: `url(${topic.icon})`,
    };
  }

  return (
    <h3 style={styles} className={style.courseTitle}>
      <img className={style.placeholder} src={topic.icon} role="presentation" alt="" />
      {course.title}
      {course.description && (<small>{course.description}</small>)}
    </h3>
  );
}

CourseTitle.propTypes = {
  topic: TopicShape.isRequired,
  course: CourseShape.isRequired,
};

export default CourseTitle;
