import React from 'react';
import PropTypes from 'prop-types';

import { mount, shallow } from 'enzyme';
import { expect } from '../../../chai_helper';
import factory from '../../../__factories__';

import Course from '../../../../components/shared/course';
import Lesson from '../../../../components/shared/course/lesson';
import Certificate from '../../../../components/shared/course/certificate';
import CourseTitle from '../../../../components/shared/course-title';

const translationContext = {
  context: {
    t(t) {
      return t;
    },
  },
  childContextTypes: { t: PropTypes.func },
};

describe('<Course/>', () => {
  const topic = factory.build('topic', {}, { coursesCount: 0 });
  const course = factory.build('course', {}, { lessonsCount: 2 });
  const lessons = course.lessons;
  topic.courses = [course];

  const lessonUrl = () => {};

  const defaultProps = {
    topic,
    course,
    lessonUrl,
  };

  it('should contain CourseTitle', () => {
    const wrapper = mount(<Course {...defaultProps} />);

    expect(wrapper).to.contain(<CourseTitle course={course} topic={topic} />);
  });

  describe('certificate', () => {
    it('should not render Certificate not present on course', () => {
      const courseWithCertificate = { ...course, certificate: false };
      const wrapper = mount(
        <Course {...defaultProps} course={courseWithCertificate} />,
        translationContext,
      );

      const certificateComponent = wrapper.find(Certificate);
      expect(certificateComponent).to.have.length(0);
    });

    describe('props', () => {
      const courseWithCertificate = { ...course, certificate: true };

      function createWrapper(props = {}) {
        return mount(
          <Course
            {...defaultProps}
            course={courseWithCertificate}
            lessonCompletionCheck={() => false}
            {...props}
          />,
          translationContext,
        );
      }

      it('should render Certificate if present on course', () => {
        const wrapper = createWrapper();

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.length(1);
      });

      it('should have the default props color and right number', () => {
        const wrapper = createWrapper();

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.props({
          color: topic.color,
          number: 3,
          isAvailable: false,
          isCompleted: false,
        });
      });

      it('should not be available if not all lessons are complete ', () => {
        const wrapper = createWrapper();

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.props({
          isAvailable: false,
        });
      });

      it('should be available if not all lessons are complete ', () => {
        const wrapper = createWrapper({ lessonCompletionCheck: () => true });

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.props({
          isAvailable: true,
        });
      });

      it('should have courseSchoolClass prop ', () => {
        const courseSchoolClass = factory.build('courseSchoolClass');
        courseWithCertificate.courseSchoolClass = courseSchoolClass;

        const wrapper = createWrapper({ courseWithCertificate });

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.props({
          courseSchoolClass,
        });
      });

      it('should be completed if certificateDownloadedCheck returns false ', () => {
        const wrapper = createWrapper({ certificateDownloadedCheck: () => false });

        const certificateComponent = wrapper.find(Certificate);

        expect(certificateComponent).to.have.props({
          isCompleted: false,
        });
      });
    });
  });

  describe('Lessons', () => {
    it('should render Lessons', () => {
      const wrapper = shallow(<Course {...defaultProps} />);

      const lesson1 = lessons[0];
      const lesson2 = lessons[1];

      const renderedLessons = wrapper.find(Lesson);

      expect(renderedLessons.at(0)).to.have.props({
        course,
        lesson: lesson1,
        number: 1,
      });

      expect(renderedLessons.at(1)).to.have.props({
        course,
        lesson: lesson2,
        number: 2,
      });
    });

    it('sets progressIndicators to true if lessonCompletionCheck is given', () => {
      const wrapper = shallow(<Course {...defaultProps} />);

      expect(wrapper.find(Lesson).at(0))
        .to.have.prop('isProgressIndicator')
        .to.equal(false);

      wrapper.setProps({ lessonCompletionCheck: null });
      expect(wrapper.find(Lesson).at(0))
        .to.have.prop('isProgressIndicator')
        .to.eql(false);

      wrapper.setProps({ lessonCompletionCheck: () => {} });
      expect(wrapper.find(Lesson).at(0))
        .to.have.prop('isProgressIndicator')
        .to.eql(true);
    });
  });

  it('sets isCompleted based on lessonCompletionCheck result', () => {
    const wrapper = shallow(<Course {...defaultProps} />);

    expect(wrapper.find(Lesson).at(0))
      .to.have.prop('isCompleted')
      .to.eql(false);

    wrapper.setProps({ lessonCompletionCheck: () => true });
    expect(wrapper.find(Lesson).at(0))
      .to.have.prop('isCompleted')
      .to.eql(true);

    wrapper.setProps({ lessonCompletionCheck: () => false });
    expect(wrapper.find(Lesson).at(0))
      .to.have.prop('isCompleted')
      .to.eql(false);
  });

  it('should have props given props', () => {
    const wrapper = mount(<Course {...defaultProps} />);

    expect(wrapper).to.have.props({
      topic,
      course,
      lessonUrl,
      lessonCompletionCheck: null,
    });

    const lessonCompletionCheck = () => true;
    wrapper.setProps({ lessonCompletionCheck });

    expect(wrapper).to.have.props({
      lessonCompletionCheck,
    });
  });
});
