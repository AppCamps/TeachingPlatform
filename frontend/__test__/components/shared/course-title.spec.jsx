import React from 'react';

import { shallow, mount } from 'enzyme';
import { expect } from '../../chai_helper';

import CourseTitle from '../../../components/shared/course-title';

describe('<CourseTitle />', () => {
  const topic = {};
  const course = {
    id: '1',
    title: 'Test Course 1',
  };

  it('should have topic specific class', () => {
    const wrapper = shallow(<CourseTitle course={course} topic={topic} />);
    expect(wrapper).to.have.className('courseTitle');
  });

  it('should have props given props', () => {
    const wrapper = mount(
      <CourseTitle
        topic={topic}
        course={course}
      />,
    );

    expect(wrapper.props().topic).to.eql(topic);
    expect(wrapper.props().course).to.eql(course);
  });

  it('should render course lists', () => {
    const wrapper = mount(
      <CourseTitle
        topic={topic}
        course={course}
      />,
    );

    expect(wrapper).to.have.tagName('h3');
    expect(wrapper).to.have.text('Test Course 1');
  });
});
