import { expect } from '../../chai_helper';
import TestStore from '../../orm-helper';

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from '../../../containers/course-lesson';

describe('mapStateToProps', () => {
  let store;
  beforeEach(() => {
    store = new TestStore();
  });

  it('includes courseSlug', () => {
    const props = mapStateToProps(store.state, { params: { courseSlug: 'testSlug' } });
    expect(props.courseSlug).to.eql('testSlug');
  });

  it('includes topicSlug', () => {
    const props = mapStateToProps(store.state, { params: { topicSlug: 'testSlug' } });
    expect(props.topicSlug).to.eql('testSlug');
  });

  describe('lesson', () => {
    describe('course', () => {
      it('defaults to empty course with courseSlug from ownProps', () => {
        const { state } = store;

        const props = mapStateToProps(state, { params: { courseSlug: 'test' } });

        expect(props.lesson.course).to.eql({ topic: {} });
      });

      it('returns matching course for courseSlug', () => {
        const { factory, state } = store;

        const course = factory.create('course');
        course.includeFk('topic');
        const matchedCourse = course.includeRef;

        const lesson = factory.create(
          'lesson',
          { course },
          {
            teachingMaterialsCount: 0,
            commonMistakes: 0,
          },
        );

        const props = mapStateToProps(state, {
          params: {
            courseSlug: course.slug,
            lessonSlug: lesson.includeRef.slug,
          },
        });

        expect(props.lesson.course).to.include(matchedCourse);
      });
    });

    it('defaults to undefined if slug does not match', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: { lessonSlug: 'test' } });
      expect(props.lesson).to.eql({ course: { topic: {} } });
    });

    it('returns matching lesson for lessonSlug', () => {
      const { factory, state } = store;

      const course = factory.create('course', {}, { lessonsCount: 0 });
      course.includeFk('topic');

      const matchedLesson = factory.create(
        'lesson',
        { course },
        {
          commonMistakesCount: 0,
          expertisesCount: 0,
          teachingMaterialsCount: 0,
        },
      );
      matchedLesson.includeMany({
        relations: ['commonMistakes', 'teachingMaterials'],
      });
      matchedLesson.includeRef.course = course.includeRef;

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: matchedLesson.slug,
          courseSlug: course.slug,
        },
      });

      expect(props.lesson).to.deep.equal(matchedLesson.includeRef);
    });
  });

  describe('prevLesson and nextLesson', () => {
    it('includes prevLesson and nextLesson', () => {
      const { factory, state } = store;

      const course = factory.create('course', {}, { lessonsCount: 0 });
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

    it('does not include nextLesson for last lesson', () => {
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

    it('defaults to null if course does not match', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: { courseSlug: 'undefined' } });
      expect(props.prevLesson).to.eql(null);
      expect(props.nextLesson).to.eql(null);
    });
  });

  describe('topic', () => {
    it('defaults to undefined if course if does not match', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: { courseSlug: 'undefined' } });
      expect(props.topic).to.eql(undefined);
    });

    it('includes matching topic in course', () => {
      const { factory, state } = store;
      const topic = factory.create('topic', {}, { coursesCount: 0 });
      const course = factory.create('course', { topic }, { lessonsCount: 0 });
      const lesson = factory.create('lesson', { course });

      const props = mapStateToProps(state, {
        params: {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
        },
      });

      expect(props.lesson.course.topic).to.eql(topic.includeRef);
    });
  });

  describe('teachingMaterials', () => {
    it('defaults to undefined if slug does not match', () => {
      const { state } = store;

      const props = mapStateToProps(state, { params: {} });
      expect(props.lesson.teachingMaterials).to.eql(undefined);
    });

    it('returns ordered teachingMaterials for lesson', () => {
      const { factory, state } = store;
      const course = factory.create('course');
      const lesson = factory.create('lesson', { course });
      const teachingMaterial2 = factory.create('teachingMaterial', { lesson, position: 2 });
      const teachingMaterial1 = factory.create('teachingMaterial', { lesson, position: 1 });

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: lesson.slug,
          courseSlug: course.slug,
        },
      });

      expect(props.lesson.teachingMaterials).to.deep.equal([
        teachingMaterial1.includeRef,
        teachingMaterial2.includeRef,
      ]);
    });
  });

  describe('commonMistakes', () => {
    it('defaults to undefined if slug does not match', () => {
      const { state } = store;
      const props = mapStateToProps(state, { params: {} });
      expect(props.lesson.commonMistakes).to.eql(undefined);
    });

    it('returns matching commonMistakes for lesson', () => {
      const { factory, state } = store;
      const course = factory.create('course');
      const lesson = factory.create('lesson', { course }, { commonMistakesCount: 0 });
      const commonMistake2 = factory.create('commonMistake', { lessons: [lesson], position: 2 });
      const commonMistake1 = factory.create('commonMistake', { lessons: [lesson], position: 1 });

      const props = mapStateToProps(state, {
        params: {
          lessonSlug: lesson.slug,
          courseSlug: course.slug,
        },
      });

      expect(props.lesson.commonMistakes).to.deep.equal([
        commonMistake1.includeRef,
        commonMistake2.includeRef,
      ]);
    });
  });
});

describe('mapDispatchToProps', () => {
  it('fetchCourses', () => {
    containerRewire.__Rewire__('fetchCourses', () => 'success');

    const dispatch = action => action;
    const actions = mapDispatchToProps(dispatch);

    expect(actions.fetchCourses()).to.equal('success');
  });
});
