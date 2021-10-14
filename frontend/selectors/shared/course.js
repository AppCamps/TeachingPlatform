import { createSelector } from "reselect";
import { ormSelector, createOrmSelector } from "../orm";

const courseSlugSelector = (state, props) => props.courseSlug;

export const courseBySlugSelector = createSelector(
  ormSelector,
  courseSlugSelector,
  createOrmSelector(({ Course }, courseSlug) =>
    Course.filter({ slug: courseSlug }).first()
  )
);
