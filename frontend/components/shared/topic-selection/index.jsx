import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape as TopicShape } from '../../../models/topic';
import Button from '../../shared/button';
import style from './style.scss';

class TopicSelection extends Component {
  renderTopicButton(topic) {
    const { selectTopic, selectedTopic } = this.props;
    const setTopic = () => selectTopic(topic.slug);
    const isSelected = topic === selectedTopic;

    const buttonStyle = {
      borderColor: topic.color,
      backgroundColor: isSelected ? topic.color : topic.lightColor,
    };

    if (!isSelected) {
      buttonStyle.color = topic.color;
    }

    return (
      <Button key={topic.id} style={buttonStyle} onClick={setTopic} className={style.topic}>
        {topic.title}
      </Button>
    );
  }

  render() {
    const { topics } = this.props;

    const topicButtons = topics.map(topic => this.renderTopicButton(topic));

    return <div>{topicButtons}</div>;
  }
}

TopicSelection.propTypes = {
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  selectedTopic: TopicShape,
  selectTopic: PropTypes.func.isRequired,
};

TopicSelection.defaultProps = {
  selectedTopic: null,
};

export default TopicSelection;
