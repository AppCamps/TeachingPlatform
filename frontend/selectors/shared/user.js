import { createSelector } from "reselect";

import { ormSelector, createOrmSelector } from "../orm";
import { authenticationSelector } from "./authentication";

export const userSelector = createSelector(
  ormSelector,
  createOrmSelector((session) => {
    const user = session.User.orderBy("fetchedAt").last();
    return user ? user.includeRef : null;
  })
);

export const userWithAuthenticationSelector = createSelector(
  userSelector,
  authenticationSelector,
  (user, { isAuthenticated }) => ({
    ...user,
    isAuthenticated,
  })
);
