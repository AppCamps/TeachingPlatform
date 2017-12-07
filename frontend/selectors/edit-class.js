import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector } from './orm';

export const paramSelector = (state, parameter) => parameter;

export const classByIdSelector =
  createSelector(
    ormSelector,
    paramSelector,
    createOrmSelector(({ Class }, classId) => {
      try {
        const klass = Class.get({ id: classId });
        klass.includeRef.courses = klass.courses.toRefArray().map(course => course.id);
        return klass.includeRef;
      } catch (e) {
        return { id: classId };
      }
    }),
  );
