import { push } from 'react-router-redux';

import { expect } from '../chai_helper';
import TestStore from '../orm-helper';

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from '../../containers/class-lesson';

describe('mapStateToProps', () => {
  let store;
  beforeEach(() => {
    store = new TestStore();
  });

  describe('class', () => {
    it('defaults to empty class with classId from ownProps', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: { classId: 'test' } });

      expect(props.class).to.eql({ id: 'test' });
    });

    it('returns matching class for classId', () => {
      const { factory, state } = store;
      const matchedClass = factory.create('class', {}, { coursesCount: 0 }).includeRef;

      const props = mapStateToProps(state, { params: { classId: matchedClass.id } });

      expect(props.class).to.deep.eql(matchedClass);
    });
  });

  describe('courseProgress', () => {
    it('defaults to both 0 if nothing is found', () => {
      const { state } = store;

      const props = mapStateToProps(state, { params: { courseSlug: 'test', classId: '123' } });

      expect(props.courseProgress).to.deep.eql({ completedLessons: 0, totalLessons: 0 });
    });

    it('returns total lessons count', () => {
      const { factory, state } = store;
      const course = factory.create('course', {}, { lessonsCount: 5 });

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: 'something-test',
          courseSlug: course.slug,
        },
      });
      expect(props.courseProgress).to.deep.eql({ completedLessons: 0, totalLessons: 5 });
    });

    it('returns completed lessons count', () => {
      const { factory, state } = store;
      const course = factory.create('course', {}, { lessonsCount: 5 });
      const lessons = course.lessons.toModelArray();
      const completedLessons = [lessons[0].id, lessons[2].id];
      const klass = factory.create('class', { completedLessons });

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: 'something-test',
          courseSlug: course.slug,
          classId: klass.id,
        },
      });
      expect(props.courseProgress).to.deep.eql({ completedLessons: 2, totalLessons: 5 });
    });
  });

  describe('lesson', () => {
    it('defaults to empty course with courseSlug from ownProps', () => {
      const { state } = store;

      const props = mapStateToProps(state, { params: { courseSlug: 'test' } });

      expect(props.lesson.course).to.eql({ topic: {} });
      expect(props.lesson.course.topic).to.eql({});
    });

    it('returns { isPersisted: true } if slug does not match', () => {
      const { factory, state } = store;
      const course = factory.create('course');
      const props = mapStateToProps(state, {
        params: {
          lessonSlug: 'something-test',
          courseSlug: course.slug,
        },
      });
      expect(props.lesson).to.eql({ isPersisted: true });
    });

    it('returns matching lesson with teachingMaterials and commonMistakes for lessonSlug', () => {
      const { factory, state } = store;

      const topic = factory.create('topic');
      const course = factory.create('course', { topic });
      course.includeFk('topic');
      const matchedCourse = course.includeRef;

      const lesson = factory.create('lesson', { course });
      lesson.includeMany({
        relations: ['teachingMaterials', 'commonMistakes'],
        modifier: ref => ref.orderBy('position'),
      });
      lesson.includeRef.course = matchedCourse;
      const matchedLesson = lesson.includeRef;

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: matchedLesson.slug,
          courseSlug: course.slug,
        },
      });

      expect(props.lesson).to.deep.eql(matchedLesson);
      expect(props.lesson.course).to.deep.eql(matchedCourse);
    });
  });

  describe('prevLesson and nextLesson', () => {
    it('includes prevLesson and nextLesson', () => {
      const { factory, state } = store;

      const course = factory.create('course');
      course.includeFk('topic');

      const lesson = factory.create(
        'lesson',
        {
          course,
          position: 2,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );
      const prevLesson = factory.create(
        'lesson',
        {
          course,
          position: 1,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );
      const nextLesson = factory.create(
        'lesson',
        {
          course,
          position: 3,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );

      const props = mapStateToProps(state, {
        params: {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
        },
      });

      expect(props.prevLesson).to.eql(prevLesson.includeRef);
      expect(props.nextLesson).to.eql(nextLesson.includeRef);
    });

    it('does not include prevlesson for first lesson', () => {
      const { factory, state } = store;

      const course = factory.create('course', {}, { lessonsCount: 0 });
      course.includeFk('topic');

      const lesson = factory.create(
        'lesson',
        {
          course,
          position: 0,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );
      factory.create(
        'lesson',
        {
          course,
          position: 1,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );

      const props = mapStateToProps(state, {
        params: {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
        },
      });

      expect(props.prevLesson).to.eql(null);
    });

    it('does not include nextlesson for last lesson', () => {
      const { factory, state } = store;

      const course = factory.create('course', {}, { lessonsCount: 0 });
      course.includeFk('topic');

      const lesson = factory.create(
        'lesson',
        {
          course,
          position: 1,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );
      factory.create(
        'lesson',
        {
          course,
          position: 0,
        },
        {
          teachingMaterialsCount: 0,
          commonMistakes: 0,
        },
      );

      const props = mapStateToProps(state, {
        params: {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
        },
      });

      expect(props.nextLesson).to.eql(null);
    });

    it('defaults to null if course if does not match', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: { courseSlug: 'undefined' } });
      expect(props.prevLesson).to.eql(null);
      expect(props.nextLesson).to.eql(null);
    });
  });
});

describe('mapDispatchToProps', () => {
  it('fetchClassById', () => {
    const fetchClassById = jest.fn();
    containerRewire.__Rewire__('fetchClassById', fetchClassById);

    const dispatch = action => action;
    const actions = mapDispatchToProps(dispatch);

    actions.fetchClassById('theSlug');
    expect(fetchClassById.mock.calls[0]).to.eql(['theSlug']);
  });

  it('markLessonAsComplete', () => {
    const markLessonAsComplete = jest.fn();
    containerRewire.__Rewire__('markLessonAsComplete', markLessonAsComplete);

    const dispatch = action => action;
    const actions = mapDispatchToProps(dispatch);

    actions.markLessonAsComplete('class', 'lesson');
    expect(markLessonAsComplete.mock.calls[0]).to.eql(['class', 'lesson']);
  });

  it('markLessonAsIncomplete', () => {
    const markLessonAsIncomplete = jest.fn();
    containerRewire.__Rewire__('markLessonAsIncomplete', markLessonAsIncomplete);

    const dispatch = action => action;
    const actions = mapDispatchToProps(dispatch);

    actions.markLessonAsIncomplete('class', 'lesson');
    expect(markLessonAsIncomplete.mock.calls[0]).to.eql(['class', 'lesson']);
  });

  it('handleBackToCourses', () => {
    const dispatch = action => action;
    const actions = mapDispatchToProps(dispatch);

    expect(actions.handleBackToClasses()).to.deep.equal(push('/classes'));
  });
});
