import { createSelector } from "reselect";

import { ormSelector, createOrmSelector } from "./orm";

export const localitySelector = createSelector(
  ormSelector,
  createOrmSelector((session) => {
    const user = session.User.orderBy("fetchedAt").last();
    const { locality } = user;
    return locality ? locality.includeRef : null;
  })
);
