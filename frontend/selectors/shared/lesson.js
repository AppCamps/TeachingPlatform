import { createSelector } from 'reselect';
import { courseBySlugSelector } from './course';

export const lessonSlugSelector = (state, props) => props.lessonSlug;

export const lessonBySlugSelector = createSelector(
  courseBySlugSelector,
  lessonSlugSelector,
  (course, lessonSlug) => {
    if (!course) {
      return { course: { topic: {} } };
    }

    const lesson = course.lessons.toModelArray().find(_lesson => _lesson.slug === lessonSlug);

    if (!lesson) {
      return { isPersisted: true };
    }

    lesson.includeMany({
      relations: ['teachingMaterials', 'commonMistakes'],
      modifier: rel => rel.orderBy('position'),
    });

    course.includeFk('topic');
    lesson.includeRef.course = course.includeRef;

    return lesson.includeRef;
  },
);

export const lessonIdsSelector = createSelector(courseBySlugSelector, (course) => {
  if (!course) {
    return [];
  }

  return course.lessons.toModelArray().map(_lesson => _lesson.id);
});

export const nextLessonBySlugSelector = createSelector(
  courseBySlugSelector,
  lessonBySlugSelector,
  (course, lesson) => {
    if (!course || !lesson) {
      return null;
    }

    const lessons = course.lessons.orderBy('position').toModelArray();
    const lessonIndex = lessons.findIndex(_lesson => _lesson.id === lesson.id);

    if (lessonIndex < lessons.length - 1) {
      return lessons[lessonIndex + 1].includeRef;
    }
    return null;
  },
);

export const prevLessonBySlugSelector = createSelector(
  courseBySlugSelector,
  lessonBySlugSelector,
  (course, lesson) => {
    if (!course || !lesson) {
      return null;
    }

    const lessons = course.lessons.orderBy('position').toModelArray();
    const lessonIndex = lessons.findIndex(_lesson => _lesson.id === lesson.id);

    if (lessonIndex > 0) {
      return lessons[lessonIndex - 1].includeRef;
    }
    return null;
  },
);
