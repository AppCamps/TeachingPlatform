import { createSelector } from 'reselect';

import { ormSelector, createOrmSelector } from '../orm';

export const topicsSelector = createSelector(
  ormSelector,
  createOrmSelector(session =>
    session.Topic
      .orderBy(t => t.title.toLowerCase())
      .all()
      .toModelArray()
      .map(topic => topic.includeRef),
  ),
);
