import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import Course from '../../course';
import Button from '../../button';
import Spinner from '../../spinner';

import CheckIcon from './icons/check';
import MinusIcon from './icons/minus';
import PlusIcon from './icons/plus';
import PlusInvertedIcon from './icons/plus-inverted';

import { Shape as TopicShape } from '../../../../models/topic';
import TopicSelection from '../../../shared/topic-selection';

import style from './style.scss';

class AddCourses extends Component {
  constructor() {
    super();
    this.state = {
      hoveredCourse: null,
    };
  }

  componentWillMount() {
    const { topics } = this.props;
    if (topics.length > 0 && !this.state.selectedTopic) {
      this.handleTopicFilterClick(topics[0].slug);
    }
  }

  @autobind
  handleBackButtonClick() {
    this.props.previousPage();
  }

  @autobind
  handleTopicFilterClick(topicSlug) {
    const selectedTopic = this.props.topics.find(topic => topic.slug === topicSlug);
    this.setState({ selectedTopic });
  }

  @autobind
  handleOnCourseClick(courseId) {
    const { onDataChanged } = this.props;

    return () => {
      if (this.selectedCourses.includes(courseId)) {
        const updatedCourses = [...this.selectedCourses];
        updatedCourses.splice(this.selectedCourses.indexOf(courseId), 1);
        this.props.change('courses', updatedCourses);
      } else {
        this.props.change('courses', this.selectedCourses.concat(courseId));
      }

      onDataChanged();

      // does not update for some reason
      this.forceUpdate();
    };
  }

  @autobind
  handleCourseHover(courseId) {
    return () => this.setState({ hoveredCourse: courseId });
  }

  get selectedCourses() {
    return this.props.formValues.courses || [];
  }

  filteredCourses() {
    const { t } = this.context;
    const { selectedTopic: topic } = this.state;

    if (!topic) {
      return null;
    }
    const { courses } = topic;

    if (courses.length === 0) {
      return t('No Courses found for topic {topic}', { topic: t(topic.title) });
    }

    return courses.map((course) => {
      const isSelected = Array.includes(this.selectedCourses, course.id);
      const isHovered = this.state.hoveredCourse === course.id;

      const courseContainerClassNames = classNames({
        [`${style.courseContainer}`]: true,
        [`${style.remove}`]: isSelected && isHovered,
      });

      const courseButtonClassNames = classNames({
        [`${style.addCourseButton}`]: true,
        [`${style.addCourseButtonRemoveIcon}`]: isSelected && isHovered,
      });

      const courseButtonStyles = { borderColor: topic.color };
      let courseButtonIcon;
      if (isSelected && isHovered) {
        courseButtonIcon = <MinusIcon color={topic.lightColor} />;
        delete courseButtonStyles.borderColor;
      } else if (!isSelected && isHovered) {
        courseButtonIcon = <PlusInvertedIcon color={topic.color} />;
      } else if (isSelected) {
        courseButtonIcon = <CheckIcon color={topic.color} />;
      } else {
        courseButtonIcon = <PlusIcon color={topic.color} />;
      }

      let courseButtonText;
      if (isSelected) {
        courseButtonText = isHovered ? t('remove') : t('added');
      } else {
        courseButtonText = t('add');
      }

      return (
        <div key={course.id} style={{ backgroundColor: topic.lightColor }}>
          <span
            tabIndex="0"
            role="menuitem"
            onClick={this.handleOnCourseClick(course.id)}
            onKeyPress={this.handleOnCourseClick(course.id)}
            onMouseEnter={this.handleCourseHover(course.id)}
            onMouseLeave={this.handleCourseHover(null)}
            className={style.link}
            style={{ outlineColor: topic.color }}
          >
            <div className={courseContainerClassNames}>
              <div style={{ color: topic.color }} className={style.addCourse}>
                <div className={style.addCourseButtonContainer}>
                  <i
                    style={courseButtonStyles}
                    className={courseButtonClassNames}
                    aria-hidden="true"
                  >
                    {courseButtonIcon}
                  </i>
                  {t(courseButtonText)}
                </div>
              </div>
              <div className={style.coursePreview}>
                <Course course={course} topic={topic} />
              </div>
            </div>
          </span>
        </div>
      );
    });
  }

  render() {
    const { t } = this.context;
    const { submitting, submitText, topics } = this.props;
    const { selectedTopic } = this.state;

    const selectTopic = topic => this.handleTopicFilterClick(topic);

    return (
      <div className={style.addCourses}>
        <h2>{t('Choose topics and courses for class')}</h2>
        <div className={style.topicFilters}>
          <TopicSelection selectedTopic={selectedTopic} topics={topics} selectTopic={selectTopic} />
        </div>
        <div role="menu">{this.filteredCourses()}</div>
        <div className={style.actions}>
          <div className={style.nextButton}>
            <Button
              isAction
              isFullWidth
              type="submit"
              onClick={this.props.handleSubmit}
              disabled={submitting}
            >
              {submitText}
            </Button>
          </div>
          <div className={style.backButton}>
            <Button
              isSecondary
              isFullWidth
              onClick={this.handleBackButtonClick}
              disabled={submitting}
              leftIcon="angle-left"
            >
              {t('Back')}
            </Button>
          </div>
          <div className={style.spinner}>
            <Spinner visible={submitting} />
          </div>
        </div>
      </div>
    );
  }
}

AddCourses.propTypes = {
  ...reduxFormPropTypes,
  submitText: PropTypes.string.isRequired,
  previousPage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDataChanged: PropTypes.func,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};

AddCourses.contextTypes = {
  t: PropTypes.func.isRequired,
};

AddCourses.defaultProps = {
  onDataChanged: () => {},
};

export default reduxForm({
  fields: ['courses'],
  form: 'classForm',
  destroyOnUnmount: false,
})(AddCourses);
