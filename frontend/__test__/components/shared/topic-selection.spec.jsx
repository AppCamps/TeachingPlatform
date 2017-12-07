import React from 'react';

import { mount, shallow } from 'enzyme';
import { expect } from '../../chai_helper';
import factory from '../../__factories__';

import Button from '../../../components/shared/button';
import TopicSelection from '../../../components/shared/topic-selection';

describe('<TopicSelection/>', () => {
  const topics = [factory.build('topic'), factory.build('topic'), factory.build('topic')];

  it('should have a button per topic', () => {
    const selectTopic = () => {};
    const selectedTopic = topics[0].id;
    const wrapper = shallow(
      <TopicSelection selectedTopic={selectedTopic} selectTopic={selectTopic} topics={topics} />,
    );

    expect(wrapper.find(Button)).to.have.length(3);
  });

  it('should have the selected topic with the dark color', () => {
    const selectTopic = () => {};
    const selectedTopic = topics[0];
    const wrapper = shallow(
      <TopicSelection selectedTopic={selectedTopic} selectTopic={selectTopic} topics={topics} />,
    );

    const buttons = wrapper.find(Button);

    // Selected
    expect(buttons.at(0).props().style.color).to.be.undefined;
    expect(buttons.at(0).props().style.backgroundColor).to.eql(topics[0].color);

    // Not selected
    expect(buttons.at(1).props().style.color).to.eql(topics[1].color);
    expect(buttons.at(1).props().style.backgroundColor).to.eql(topics[1].lightColor);
    expect(buttons.at(2).props().style.color).to.eql(topics[2].color);
    expect(buttons.at(2).props().style.backgroundColor).to.eql(topics[2].lightColor);
  });

  it('should call selectTopic when button is pressed', () => {
    let clickedTopic;
    const selectTopic = (topicId) => {
      clickedTopic = topicId;
    };
    const selectedTopic = topics[0];
    const wrapper = mount(
      <TopicSelection selectedTopic={selectedTopic} selectTopic={selectTopic} topics={topics} />,
    );

    const buttons = wrapper.find(Button);
    buttons.at(1).simulate('click');

    expect(clickedTopic).to.eql(topics[1].slug);
  });
});
