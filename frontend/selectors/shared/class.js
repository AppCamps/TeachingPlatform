import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector } from '../orm';

export const paramSelector = (state, parameter) => parameter;

export const classByIdSelector = createSelector(
  ormSelector,
  paramSelector,
  createOrmSelector(({ Class }, classId) => {
    try {
      return Class.get({ id: classId }).includeRef;
    } catch (e) {
      return { id: classId };
    }
  }),
);

export const completedLessonIdsSelector = createSelector(
  classByIdSelector,
  klass => klass.completedLessons || [],
);
