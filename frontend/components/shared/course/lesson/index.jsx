import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import classNames from "classnames";
import flatMap from "lodash.flatmap";

import { Shape as LessonShape } from "../../../../models/lesson";

import { colors } from "../../../../config";
import Number from "../../number";

import style from "./style.scss";

class Lesson extends Component {
  expertises() {
    const { expertises } = this.props.lesson;
    if (expertises.length === 0) {
      return null;
    }

    const renderedExpertises = flatMap(expertises, (expertise) => [
      <span key={expertise.id}>{expertise.title}</span>,
      ", ",
    ]);
    renderedExpertises.pop();

    return <div className={style.expertises}>{renderedExpertises}</div>;
  }

  render() {
    const {
      lesson,
      number,
      lessonUrl,
      isProgressIndicator,
      isCompleted,
      color,
    } = this.props;

    const classes = classNames({
      [`${style.lessonProgress}`]: isProgressIndicator,
    });

    const borderColor = color;
    const customStyle = {
      color,
      borderColor: color,
    };

    let components = (
      <div className={classes} style={customStyle}>
        <div className={style.numberContainer} style={{ borderColor }}>
          <Number number={number} color={color} invert={isCompleted} />
        </div>
        <div className={style.lessonTitle}>{lesson.title}</div>
        {this.expertises()}
      </div>
    );

    if (lessonUrl) {
      const link = lessonUrl(this.props);
      components = <Link to={link}>{components}</Link>;
    }

    return <div className={style.lesson}>{components}</div>;
  }
}

Lesson.propTypes = {
  lessonUrl: PropTypes.func,
  number: PropTypes.number.isRequired,
  isProgressIndicator: PropTypes.bool,
  isCompleted: PropTypes.bool,
  lesson: LessonShape.isRequired,
  color: PropTypes.string,
};

Lesson.defaultProps = {
  lessonUrl: null,
  isCompleted: false,
  isProgressIndicator: false,
  color: colors.colorFontDefault,
};

export default Lesson;
