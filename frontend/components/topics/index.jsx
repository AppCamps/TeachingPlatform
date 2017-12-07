import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Shape as TopicShape } from '../../models/topic';

import Title from '../shared/title';
import Spinner from '../shared/spinner';
import TopicSelection from '../shared/topic-selection';
import Link from '../shared/link';

import style from './style.scss';

class Topics extends Component {
  constructor() {
    super();
    // Initial state
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchCourses();
    this.props.fetchPreparationMaterials();
  }

  componentWillReceiveProps({ topics, selectedTopic, selectTopic }) {
    if (topics && topics.length > 0) {
      if (!selectedTopic) {
        selectTopic(topics[0].slug);
      }
    }
  }

  renderContentMaterialToggle() {
    const { t } = this.context;
    const { selectedTopic: topic, location: { pathname } } = this.props;

    let preparationsSelected = false;
    if (pathname.match(/\/preparations$/)) {
      preparationsSelected = true;
    }

    const selectedButtonStyle = {
      width: '50%',
      borderColor: topic.color,
      backgroundColor: topic.color,
    };

    const unselectedButtonStyle = {
      width: '50%',
      borderColor: topic.lightColor,
      color: topic.color,
      backgroundColor: topic.lightColor,
    };

    return (
      <div className={style.materialToggle}>
        <Link
          button
          style={preparationsSelected ? selectedButtonStyle : unselectedButtonStyle}
          to={`/topics/${topic.slug}/preparations`}
        >
          {t('Preparation')}
        </Link>{' '}
        <Link
          button
          style={preparationsSelected ? unselectedButtonStyle : selectedButtonStyle}
          to={`/topics/${topic.slug}`}
        >
          {t('Course offering')}
        </Link>
      </div>
    );
  }

  render() {
    const { t } = this.context;
    const { selectedTopic, topics, selectTopic, children } = this.props;

    if (!selectedTopic) {
      return (
        <div className={style.spinnerContainer}>
          <Spinner visible />
        </div>
      );
    }

    return (
      <div className={style.container}>
        <div className={style.courses}>
          <div>
            <TopicSelection
              selectedTopic={selectedTopic}
              topics={topics}
              selectTopic={selectTopic}
            />
          </div>
          <div key={selectedTopic.slug} className={style.contentContainer}>
            <Title primary color={selectedTopic.color} tag={'h2'}>
              {t(selectedTopic.title)}
            </Title>
            {this.renderContentMaterialToggle()}
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Topics.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  selectTopic: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  fetchPreparationMaterials: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(TopicShape),
  selectedTopic: PropTypes.shape(TopicShape),
  children: PropTypes.node,
};

Topics.defaultProps = {
  topics: null,
  selectedTopic: null,
  children: null,
};

Topics.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Topics;
