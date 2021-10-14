import React, { Component } from "react";
import PropTypes from "prop-types";

import { Shape as TopicShape } from "../../../models/topic";
import { Shape as CourseShape } from "../../../models/course";

import CourseTitle from "../../shared/course-title";
import Lesson from "./lesson";
import Certificate from "./certificate";

import style from "./style.scss";

class Course extends Component {
  isLessonCompleted(lesson) {
    const { lessonCompletionCheck } = this.props;
    const isProgressIndicator = (lessonCompletionCheck && true) || false;

    return isProgressIndicator && lessonCompletionCheck(lesson);
  }

  lessons() {
    const { course, topic, lessonUrl, lessonCompletionCheck } = this.props;
    const isProgressIndicator = (lessonCompletionCheck && true) || false;

    return course.lessons.map((lesson, index) => (
      <Lesson
        key={lesson.id}
        lesson={lesson}
        course={course}
        number={index + 1}
        lessonUrl={lessonUrl}
        isProgressIndicator={isProgressIndicator}
        isCompleted={this.isLessonCompleted(lesson)}
        color={topic.color}
      />
    ));
  }

  render() {
    const {
      course,
      course: { courseSchoolClass },
      downloadCertificate,
      topic,
    } = this.props;

    const areAllLessonsComplete =
      course.lessons
        .map((lesson) => this.isLessonCompleted(lesson))
        .indexOf(false) === -1;

    return (
      <div className={style.course}>
        <CourseTitle course={course} topic={topic} />
        <div>
          {this.lessons()}
          {course.certificate && (
            <Certificate
              number={course.lessons.length + 1}
              color={topic.color}
              isAvailable={areAllLessonsComplete}
              courseSchoolClass={courseSchoolClass}
              downloadCertificate={downloadCertificate}
            />
          )}
        </div>
      </div>
    );
  }
}

Course.propTypes = {
  course: CourseShape.isRequired,
  topic: TopicShape.isRequired,
  lessonUrl: PropTypes.func.isRequired,
  lessonCompletionCheck: PropTypes.func,
  downloadCertificate: PropTypes.func,
};

Course.defaultProps = {
  lessonCompletionCheck: null,
  courseSchoolClass: null,
  downloadCertificate: () => null,
};

export default Course;
