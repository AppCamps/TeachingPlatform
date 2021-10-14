import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import autobind from "autobind-decorator";
import { Shape as ClassShape } from "../../models/class";
import { NoClasses } from "./no-classes";
import Course from "../shared/course";
import FaIcon from "../shared/fa-icon";
import Link from "../shared/link";
import Button from "../shared/button";
import Trophy from "../atoms/a-trophy";

import style from "./style.scss";

const MAX_DEFAULT_VISIBLE_CLASSES = 6;

class Classes extends Component {
  componentDidMount() {
    this.props.fetchCourses();
    this.props.fetchClasses();
    // Reset state
    this.props.setShowTop();
  }

  handleClassClick(klass) {
    const { toggleClass } = this.props;
    toggleClass(klass);
  }

  @autobind
  async handleSubmit(event, klass) {
    event.preventDefault();
    const { t } = this.context;
    // eslint-disable-next-line no-alert
    const archiveRequestConfirmed = confirm(t("Archive confirmation message"));

    if (archiveRequestConfirmed) {
      this.archiveClass(klass);
    }
  }

  @autobind
  async archiveClass(klass) {
    const { archiveClass } = this.props;
    try {
      // The updateClass promise resolves after the change page action
      // is called. It is necessary to change the state before and
      // revert it if the promise rejects.
      this.setState({
        ...this.state,
        isSubmitted: true,
      });

      archiveClass(klass.id);
    } catch (e) {
      // Did not submit successfully
      this.setState({
        ...this.state,
        isSubmitted: false,
      });
    }
  }

  renderClass(klass) {
    const { t } = this.context;
    const { openedClassIds, downloadCertificate } = this.props;
    const { courses } = klass;

    const lessonUrl = ({ lesson, course }) =>
      `/classes/${klass.id}/${course.slug}/${lesson.slug}`;

    const opened = Array.includes(openedClassIds, klass.id);
    let courseTitles;
    if (opened) {
      const lessonCompletionCheck = (lesson) =>
        Array.includes(klass.completedLessons, lesson.id);
      let renderedCourses;

      if (courses.length > 0) {
        renderedCourses = courses.map((course) => {
          const topic = course.topic;
          const courseProps = {
            topic,
            course,
            lessonUrl,
            lessonCompletionCheck,
            downloadCertificate,
          };
          return (
            <div key={course.id} className={style.course}>
              <Course {...courseProps} />
            </div>
          );
        });
      } else {
        renderedCourses = (
          <div className={style.noCourses}>
            {t("You did not add any courses yet")}
          </div>
        );
      }

      courseTitles = (
        <div className={style.body}>
          {renderedCourses}
          <div className={style.bodyActions}>
            <form
              onSubmit={(event) => {
                this.handleSubmit(event, klass);
              }}
              className={style.formArchiveClass}
            >
              <Button type="submit" isSecondary leftIcon="trash">
                {t("Archive class")}
              </Button>
            </form>
            <Link to={`/classes/${klass.id}/edit`} button leftIcon="pencil">
              {t("Edit class")}
            </Link>
          </div>
        </div>
      );
    } else {
      courseTitles = null;
    }

    const headerClasses = classNames({
      [`${style.head}`]: true,
      [`${style.open}`]: opened,
    });

    const expandIcon = opened ? "angle-down" : "angle-right";
    const klassLessonsCount = courses.reduce(
      (memo, course) => memo + course.lessons.length,
      0
    );
    const completedLessonsQuotient =
      klass.completedLessons.length / klassLessonsCount;

    let classActionButton = null;
    const { continueLesson } = klass;

    const isStarted = completedLessonsQuotient > 0;
    const isCompleted = completedLessonsQuotient === 1;

    const progressBar = isStarted ? (
      <span
        style={{ width: `${completedLessonsQuotient * 100}%` }}
        className={style.progress}
      />
    ) : (
      <div className={style.placeholder}>{t("Not yet started")}</div>
    );

    const helpText =
      !isStarted && opened ? (
        <p className={style.helpText}>
          <span>{t("Not yet started")}:</span>
          {t(
            "As soon as you mark the first lession as completed, you will see in the progress bar how far are you in the class."
          )}
          .
        </p>
      ) : null;

    if (continueLesson) {
      const continueLessonUrl = lessonUrl({
        course: continueLesson.course,
        lesson: continueLesson,
      });

      classActionButton = (
        <Link
          to={continueLessonUrl}
          className={style.btCourse}
          button
          isAction
          rightIcon="angle-right"
        >
          {isStarted ? t("Continue course") : t("Start course")}
        </Link>
      );
    } else if (isCompleted) {
      classActionButton = <Trophy text={t("Successfully concluded")} />;
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div key={klass.id} className={style.class}>
        <div
          tabIndex="0"
          role="menuitem"
          onClick={() => this.handleClassClick(klass)}
          className={headerClasses}
        >
          <div className={style.name}>
            <span className={style.expandIcon}>
              <FaIcon icon={expandIcon} />
            </span>
            <span className={style.title}>{klass.title}</span>
            <span className={style.identifier}>({klass.identifier})</span>
          </div>
          <div className={style.progressBarContainer}>
            <div className={style.progressBar}>{progressBar}</div>
          </div>
          <div className={style.continue}>{classActionButton}</div>
        </div>
        {helpText}
        {courseTitles}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }

  renderClassList() {
    const { classes, showAll, setShowAll } = this.props;
    const { t } = this.context;

    const notArchivedClasses = classes.filter((klass) => !klass.archived);

    if (!notArchivedClasses || notArchivedClasses.length === 0) {
      return <NoClasses />;
    }
    // Show newest first
    const sortedClasses = notArchivedClasses
      // Creates a copy to not mutate original
      .slice()
      // Reverses order
      .reverse();

    // Filter number of classes to be shown, depending on current filter
    const visibleClasses =
      !showAll && sortedClasses.length > MAX_DEFAULT_VISIBLE_CLASSES
        ? sortedClasses.slice(0, MAX_DEFAULT_VISIBLE_CLASSES)
        : sortedClasses;

    // Just a flag to show or hide "Show all classes" button
    const areClassesHidden = visibleClasses.length !== sortedClasses.length;

    // Map classes to components
    const classList = visibleClasses.map((klass) => this.renderClass(klass));

    return (
      <div>
        <div role="menu">{classList}</div>
        {areClassesHidden && (
          <div className={style.menuActions}>
            <Button className={style.btShowAll} onClick={setShowAll}>
              {t("Show all classes")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { t } = this.context;

    return (
      <div className={style.container}>
        <div className={style.classes}>
          <h1>{t("My classes")}</h1>
          <Link to="/classes/new">
            <div className={style.createClass}>
              <FaIcon icon="plus" />
              <span className={style.createClassText}>
                {t("Add a new class")}
              </span>
            </div>
          </Link>
          {this.renderClassList()}
        </div>
      </div>
    );
  }
}

Classes.propTypes = {
  archiveClass: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  fetchClasses: PropTypes.func.isRequired,
  downloadCertificate: PropTypes.func.isRequired,
  classes: PropTypes.arrayOf(ClassShape),
  setShowAll: PropTypes.func.isRequired,
  setShowTop: PropTypes.func.isRequired,
  showAll: PropTypes.bool,
  openedClassIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleClass: PropTypes.func.isRequired,
};

Classes.contextTypes = {
  t: PropTypes.func.isRequired,
};

Classes.defaultProps = {
  classes: [],
  showAll: false,
};

export default Classes;
