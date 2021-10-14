import React, { Component } from "react";
import PropTypes from "prop-types";
import reactParser from "html-react-parser";
import { Link } from "react-router";
import classNames from "classnames";

import Title from "../../shared/title";
import FaIcon from "../../shared/fa-icon";

import { Shape as CourseShape } from "../../../models/course";
import { Shape as LessonShape } from "../../../models/lesson";

import { isInternalCardLink } from "../../../utils";

import TeachingMaterial from "./teaching-material";

import style from "./style.scss";

class Lesson extends Component {
  lessonContent() {
    const { teachingMaterials } = this.props.lesson;
    const { t } = this.context;
    if (!teachingMaterials || teachingMaterials.length === 0) {
      return null;
    }

    const renderedMaterials = teachingMaterials
      .filter((tm) => tm.lessonContent)
      .map((teachingMaterial, index) => {
        const number = index + 1;
        return (
          <div
            key={`content-${teachingMaterial.id}`}
            className={style.lessonMaterial}
          >
            <TeachingMaterial {...{ teachingMaterial, number }} />
          </div>
        );
      });

    return (
      <div className={style.lessonContent}>
        <Title>{t("Lesson content")}</Title>
        <div>{renderedMaterials}</div>
      </div>
    );
  }

  commonMistakes() {
    const { t } = this.context;
    const { commonMistakes } = this.props.lesson;
    if (!commonMistakes || commonMistakes.length === 0) {
      return null;
    }

    const mistakes = commonMistakes.map((commonMistake) => (
      <li key={commonMistake.id}>
        <div className={style.lessonCommonMistakeProblem}>
          {commonMistake.problem}
        </div>
        <div className={style.lessonCommonMistakeSolution}>
          {reactParser(commonMistake.solution)}
        </div>
      </li>
    ));

    return (
      <span>
        <dt className={style.lessonHintTitle}>
          <span className={style.lessonHintIcon}>
            <FaIcon icon="exclamation-triangle" />
          </span>
          <dfn>{t("Common mistakes")}</dfn>
        </dt>
        <dd className={style.lessonHintDescription}>
          <ul>{mistakes}</ul>
        </dd>
      </span>
    );
  }

  teachingMaterials() {
    const { teachingMaterials } = this.props.lesson;
    const filteredTeachingMaterials = (teachingMaterials || []).filter(
      (tm) => tm.listingItem && !isInternalCardLink(tm.link)
    );

    if (filteredTeachingMaterials.length === 0) {
      return null;
    }

    return filteredTeachingMaterials.map((teachingMaterial) => {
      let icon = null;
      if (teachingMaterial.listingIcon && teachingMaterial.listingIcon !== "") {
        icon = (
          <span className={style.lessonHintIcon}>
            <FaIcon icon={teachingMaterial.listingIcon} />
          </span>
        );
      }

      return (
        <span key={`hint-${teachingMaterial.id}`} className={style.lessonHint}>
          <dt className={style.lessonHintTitle}>
            {icon}
            <dfn>{teachingMaterial.listingTitle}</dfn>
          </dt>
          <dd className={style.lessonHintDescription}>
            <a
              href={teachingMaterial.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              {teachingMaterial.link}
            </a>
          </dd>
        </span>
      );
    });
  }

  lessonInfo() {
    const { t } = this.context;

    return (
      <div className={style.lessonInfo}>
        <Title>{t("Lesson links & hints")}</Title>
        <dl>
          {this.commonMistakes()}
          {this.teachingMaterials()}
        </dl>
      </div>
    );
  }

  lessonNavigation() {
    const { t } = this.context;
    const { lessonUrl, nextLesson, prevLesson } = this.props;
    const lessonLinks = [];
    if (prevLesson) {
      const prevLessonClassNames = classNames({
        [`${style.lessonNavigationFarther}`]: nextLesson,
      });
      lessonLinks.push(
        <span key={prevLesson.id} className={prevLessonClassNames}>
          <FaIcon icon="angle-left" />{" "}
          <Link to={lessonUrl(prevLesson)}>{t("previous lesson")}</Link>
        </span>
      );
    }
    if (nextLesson) {
      lessonLinks.push(
        <span key={nextLesson.id}>
          <Link to={lessonUrl(nextLesson)}>{t("next lesson")}</Link>{" "}
          <FaIcon icon="angle-right" />
        </span>
      );
    }
    return lessonLinks;
  }

  render() {
    const { t } = this.context;
    const { course, lesson, lessonActions, title, courseProgress } = this.props;
    const topic = course.topic;

    return (
      <div className={style.container}>
        <div className={style.lessonContainer}>
          <div className={style.lesson}>
            <h1 className={style.headerTitle}>
              {title}
              {courseProgress && (
                <span className={style.courseProgress}>
                  (
                  {t(
                    "completed {completedLessons} of {totalLessons} lessons",
                    courseProgress
                  )}
                  )
                </span>
              )}
            </h1>
            <div className={style.lessonNavigation}>
              {this.lessonNavigation()}
            </div>
            <h2 className={style.topicTitle}>{t(topic.title)}</h2>
            <h3
              className={style.title}
            >{`${course.title} - ${lesson.title}`}</h3>
            <div className={style.lessonDescription}>
              {reactParser(lesson.description || "")}
            </div>
            {this.lessonContent()}
            <div className={style.lessonActions}>{lessonActions}</div>
          </div>
        </div>
        <div className={style.lessonInfoContainer}>{this.lessonInfo()}</div>
      </div>
    );
  }
}

Lesson.contextTypes = {
  t: PropTypes.func.isRequired,
};

Lesson.propTypes = {
  course: CourseShape.isRequired,
  lesson: LessonShape.isRequired,
  lessonActions: PropTypes.element,
  lessonUrl: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  prevLesson: LessonShape,
  nextLesson: LessonShape,
  courseProgress: PropTypes.shape({
    lessonCount: PropTypes.number,
    totalLessons: PropTypes.number,
  }),
};

Lesson.defaultProps = {
  lessonActions: null,
  prevLesson: null,
  nextLesson: null,
  courseProgress: null,
};

export default Lesson;
