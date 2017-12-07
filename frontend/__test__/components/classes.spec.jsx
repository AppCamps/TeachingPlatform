import React from 'react';

import { Link } from 'react-router';

import { mount, shallow } from 'enzyme';
import { expect } from '../chai_helper';
import factory from '../__factories__';

import LinkWrapper from '../../components/shared/link';
import Course from '../../components/shared/course';
import Lesson from '../../components/shared/course/lesson';

import Classes from '../../components/classes';
import { NoClasses } from '../../components/classes/no-classes';

import style from '../../components/classes/style.scss';

describe('<Classes />', () => {
  const classes = factory.buildList('schoolClass', 1);

  const fetchClasses = () => true;
  const fetchCourses = () => true;
  const setShowTop = () => null;
  const setShowAll = () => null;
  const showAll = true;
  const defaultProps = {
    classes,
    fetchClasses,
    fetchCourses,
    setShowTop,
    setShowAll,
    showAll,
    openedClassIds: [],
    toggleClass: () => null,
  };

  it('should call fetchClasses on mount', () => {
    const fetchClassesMock = jest.fn();
    mount(<Classes {...defaultProps} fetchClasses={fetchClassesMock} />, {
      context: { t: translationString => translationString },
    });

    expect(fetchClassesMock.mock.calls).to.have.length(1);
  });

  it('renders a link to class creation', () => {
    const wrapper = mount(<Classes {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    const link = wrapper.find(LinkWrapper).at(0);

    expect(link.prop('to')).to.equal('/classes/new');
    expect(link).to.have.text('Add a new class');
  });

  it('should render no classes text for empty classes', () => {
    const wrapper = shallow(<Classes {...defaultProps} classes={[]} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(wrapper.find(NoClasses)).to.have.length(1);
  });

  it('should contain headings', () => {
    const wrapper = mount(<Classes {...defaultProps} />, {
      context: { t: translationString => translationString },
    });

    expect(wrapper).to.contain(<h1>My classes</h1>);
  });

  it('lists classes', () => {
    const classList = factory.buildList('schoolClass', 3);
    const klass = classList[0];

    const wrapper = mount(<Classes {...defaultProps} classes={classList} />, {
      context: { t: translationString => translationString },
    });

    const classContainers = wrapper.find(`.${style.class}`);

    expect(classContainers.length).to.equal(3);

    expect(classContainers.at(0).find(`.${style.title}`)).to.have.text(klass.title);
    expect(classContainers.at(0).find(`.${style.identifier}`)).to.have.text(klass.identifier);
  });

  it('has button to start courses, if no session marked as completed', () => {
    const klass = factory.build('schoolClass', {}, { coursesCount: 0 });
    klass.continueLesson = { slug: 'link', course: { slug: 'some' } };

    const wrapper = mount(<Classes {...defaultProps} classes={[klass]} />, {
      context: { t: translationString => translationString },
    });

    const continueLink = wrapper.find(`.${style.continue}`);
    expect(continueLink).to.have.text('Start course');
    expect(continueLink.find(Link)).to.have.prop('to', `/classes/${klass.id}/some/link`);
  });

  it('has button to continue courses, if at least one session is completed', () => {
    const lesson = factory.build('lesson', { slug: 'someLesson' });
    const course = factory.build('course', { lessons: [lesson], slug: 'someCourse' });
    const klass = factory.build('schoolClass', { courses: [course] }, { coursesCount: 1 });
    klass.continueLesson = { slug: 'link', course };
    klass.completedLessons = [lesson.id];

    const wrapper = mount(<Classes {...defaultProps} classes={[klass]} />, {
      context: { t: translationString => translationString },
    });

    const continueLink = wrapper.find(`.${style.continue}`);
    expect(continueLink).to.have.text('Continue course');
    expect(continueLink.find(Link)).to.have.prop('to', `/classes/${klass.id}/someCourse/link`);
  });

  it('is possible to open and close classes and shows no courses message', () => {
    const klass = factory.build('schoolClass', {}, { coursesCount: 0 });
    const toggleClass = jest.fn();

    const wrapper = mount(
      <Classes {...defaultProps} classes={[klass]} toggleClass={toggleClass} />,
      { context: { t: translationString => translationString } },
    );

    expect(wrapper.find(`.${style.body}`).length).to.equal(0);

    wrapper.find(`.${style.head}`).simulate('click');

    expect(toggleClass.mock.calls).to.have.length(1);
    expect(toggleClass.mock.calls[0]).to.eql([klass]);
  });

  it('has edit button and shows no courses message', () => {
    const klass = factory.build('schoolClass', {}, { coursesCount: 0 });
    const toggleClass = jest.fn();

    const wrapper = mount(
      <Classes
        {...defaultProps}
        classes={[klass]}
        toggleClass={toggleClass}
        openedClassIds={[klass.id]}
      />,
      { context: { t: translationString => translationString } },
    );

    const editButton = wrapper.find(`.${style.body}`).find(LinkWrapper);

    expect(editButton).to.have.text('Edit class');
    expect(editButton).to.have.prop('to', `/classes/${klass.id}/edit`);

    expect(wrapper.find(`.${style.body}`).length).to.equal(1);
    expect(wrapper.find(`.${style.noCourses}`)).to.have.text('You did not add any courses yet');
  });

  it('is possible to close class', () => {
    const klass = factory.build('schoolClass', {}, { coursesCount: 0 });
    const toggleClass = jest.fn();

    const wrapper = mount(
      <Classes
        {...defaultProps}
        classes={[klass]}
        toggleClass={toggleClass}
        openedClassIds={[klass.id]}
      />,
      { context: { t: translationString => translationString } },
    );

    expect(wrapper.find(`.${style.body}`).length).to.equal(1);

    wrapper.find(`.${style.head}`).simulate('click');

    expect(toggleClass.mock.calls).to.have.length(1);
    expect(toggleClass.mock.calls[0]).to.eql([klass]);
  });

  it('renders courses with Lessons, lesson progress with a "not yet started" message and proper class-lesson link', () => {
    const lesson = factory.build('lesson', { slug: 'testCase' });
    const course = factory.build(
      'course',
      {
        slug: 'another',
        lessons: [lesson],
        topic: factory.build('topic', {}, { coursesCount: 0, preparationMaterialsCount: 0 }),
      },
      { lessonsCount: 0 },
    );
    const klass = factory.build('class', { courses: [course] }, { coursesCount: 1 });

    const wrapper = mount(
      <Classes {...defaultProps} classes={[klass]} openedClassIds={[klass.id]} />,
      {
        context: { t: translationString => translationString },
      },
    );

    const renderedCourse = wrapper.find(Course);
    expect(renderedCourse.prop('course')).to.equal(course);

    let renderedLesson = wrapper.find(Lesson);
    expect(renderedLesson.find(Link)).to.have.prop('to', `/classes/${klass.id}/another/testCase`);
    expect(renderedLesson).to.have.prop('isCompleted', false);

    expect(wrapper.find(`p.${style.helpText}`)).to.contain.text('Not yet started');

    const newKlass = { ...klass, completedLessons: [lesson.id] };

    wrapper.setProps({ classes: [newKlass] });

    expect(wrapper.find(`.${style.progress}`)).to.have.style('width', '100%');

    renderedLesson = wrapper.find(Lesson);
    expect(renderedLesson).to.have.prop('isCompleted', true);
  });

  it('renders courses with Lessons, lesson progress and proper class-lesson link', () => {
    const lesson1 = factory.build('lesson', { slug: 'testCase1-lesson1' });
    const lesson2 = factory.build('lesson', { slug: 'testCase1-lesson2' });
    const course = factory.build(
      'course',
      {
        slug: 'another',
        lessons: [lesson1, lesson2],
        topic: factory.build('topic', {}, { coursesCount: 1, preparationMaterialsCount: 0 }),
      },
      { lessonsCount: 0 },
    );
    const klass = factory.build(
      'class',
      { courses: [course], completedLessons: [lesson2.id] },
      { coursesCount: 1 },
    );

    const wrapper = mount(
      <Classes {...defaultProps} classes={[klass]} openedClassIds={[klass.id]} />,
      {
        context: { t: translationString => translationString },
      },
    );

    const renderedCourse = wrapper.find(Course);
    expect(renderedCourse.prop('course')).to.equal(course);

    let renderedLesson = wrapper.find(Lesson).first();

    expect(renderedLesson.find(Link)).to.have.prop(
      'to',
      `/classes/${klass.id}/another/testCase1-lesson1`,
    );
    expect(renderedLesson).to.have.prop('isCompleted', false);

    expect(wrapper.find(`.${style.progress}`)).to.have.style('width', '50%');

    const newKlass = { ...klass, completedLessons: [lesson1.id, lesson2.id] };

    wrapper.setProps({ classes: [newKlass] });

    expect(wrapper.find(`.${style.progress}`)).to.have.style('width', '100%');

    renderedLesson = wrapper.find(Lesson).first();
    expect(renderedLesson).to.have.prop('isCompleted', true);
  });
});
