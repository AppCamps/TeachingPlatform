import React from 'react';

import { Link } from 'react-router';
import sortBy from 'lodash.sortby';

import { mount, shallow } from 'enzyme';
import { expect } from '../../../chai_helper';
import factory from '../../../__factories__';

import Lesson from '../../../../components/shared/course/lesson';
import style from '../../../../components/shared/course/lesson/style.scss';

import Number from '../../../../components/shared/number';

describe('<Lesson/>', () => {
  const lesson = factory.build('lesson');
  const number = 42;
  const isProgressIndicator = false;

  const defaultProps = {
    lesson,
    number,
    isProgressIndicator,
  };

  it('should contain Lesson Title', () => {
    const wrapper = shallow(<Lesson {...defaultProps} />);

    expect(wrapper.find('.lessonTitle')).to.have.text(lesson.title);
  });

  it('should contain Number', () => {
    const wrapper = shallow(<Lesson {...defaultProps} number={3} />);

    expect(wrapper.containsMatchingElement(<Number number={3} />)).to.equal(true);
  });

  it('should contain not contain Link to Lesson by default', () => {
    const wrapper = shallow(<Lesson {...defaultProps} />);
    expect(wrapper.find(Link)).to.be.empty;
  });

  it('should use lessonUrl with props for url generation', () => {
    const lessonUrl = (props) => {
      const _lesson = props.lesson;
      return `/courses/courseSlug/${_lesson.slug}`;
    };
    const lessonWithSlug = {
      ...lesson,
      slug: 'lessonSlug',
    };
    const wrapper = shallow(
      <Lesson {...defaultProps} lesson={lessonWithSlug} lessonUrl={lessonUrl} />,
    );
    expect(wrapper.find(Link).prop('to')).to.equal(`/courses/courseSlug/${lessonWithSlug.slug}`);
  });

  it('should have default props', () => {
    const wrapper = mount(<Lesson {...defaultProps} />);

    expect(wrapper).to.have.props({
      lessonUrl: null,
      isProgressIndicator: false,
      color: style.colorFontDefault,
    });
  });

  it('should have props given props', () => {
    const props = {
      lesson,
      lessonUrl: () => 'test.de',
      number: 42,
      isProgressIndicator: true,
      isCompleted: false,
      color: '#FFAAFF',
    };

    const wrapper = mount(<Lesson {...props} />);
    expect(wrapper).to.have.props(props);
  });

  describe('expertises', () => {
    it('should list expertises in an ordered comma separated string', () => {
      const unsortedExpertises = factory.buildList('expertise', 3);
      const expertises = sortBy(
        unsortedExpertises,
        expertise => expertise.title.toLowerCase(),
      );
      const lessonWithExpertises = {
        ...lesson,
        expertises,
      };
      const expertisesText = expertises.map(ex => ex.title).join(', ');

      const wrapper = shallow(<Lesson {...defaultProps} lesson={lessonWithExpertises} />);
      expect(wrapper.find(`.${style.expertises}`)).to.have.text(expertisesText);
    });

    it('should only show a single expertise for single expertise', () => {
      const expertise = factory.build('expertise');
      const lessonWithExpertises = { ...lesson, expertises: [expertise] };
      const wrapper = shallow(<Lesson {...defaultProps} lesson={lessonWithExpertises} />);

      expect(wrapper.find(`.${style.expertises}`)).to.have.text(expertise.title);
    });

    it('should show nothing for empty expertises', () => {
      const lessonWithoutExpertises = { ...lesson, expertises: [] };
      const wrapper = shallow(<Lesson {...defaultProps} lesson={lessonWithoutExpertises} />);

      expect(wrapper.find(`.${style.expertises}`).length).to.equal(0);
    });
  });
});
