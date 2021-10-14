import { createSelector } from "reselect";

import { ormSelector, createOrmSelector } from "../orm";

export const countriesSelector = createSelector(
  ormSelector,
  createOrmSelector((session) => session.Country.all().toRefArray())
);
