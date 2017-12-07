import { createSelector } from 'redux-orm';

import orm from '../../orm';

export const ormSelector = state => state.orm;
export const createOrmSelector = fn => createSelector(orm, fn);

export const newCreateOrmSelector = (...rest) => createSelector(orm, ormSelector, ...rest);
