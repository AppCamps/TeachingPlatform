import React from 'react';

import { shallow, mount } from 'enzyme';

import { expect } from '../../chai_helper';
import factory from '../../__factories__';

import CourseList from '../../../components/topics/course-list';
import Course from '../../../components/shared/course';

describe('<CourseList/>', () => {
  const topic = factory.build('topic', {}, { preparationMaterialsCount: 0 });
  const courses = topic.courses;

  const defaultProps = {
    courses,
    topic,
  };

  it('should have topic specific class', () => {
    const wrapper = shallow(<CourseList {...defaultProps} />, { context: { t: t => t } });
    expect(wrapper.find('.courseList')).to.have.length(1);
  });

  it('should have given props', () => {
    const wrapper = mount(<CourseList {...defaultProps} />, { context: { t: t => t } });

    expect(wrapper.props().topic).to.eql(topic);
    expect(wrapper.props().courses).to.eql(courses);
  });

  it('should render course lists with lessons', () => {
    const wrapper = shallow(<CourseList {...defaultProps} />, { context: { t: t => t } });

    expect(wrapper.containsMatchingElement(<Course course={courses[0]} topic={topic} />)).to.eql(
      true,
    );
    expect(wrapper.containsMatchingElement(<Course course={courses[1]} topic={topic} />)).to.eql(
      true,
    );
  });

  it('should give correct lessonUrl prop', () => {
    const wrapper = shallow(<CourseList {...defaultProps} />, { context: { t: t => t } });

    const lessonUrlFn = wrapper
      .find(Course)
      .first()
      .prop('lessonUrl');
    const fnParams = { lesson: { slug: 'test' } };

    expect(lessonUrlFn(fnParams)).to.eql(`/topics/${topic.slug}/${courses[0].slug}/test`);
  });
});
