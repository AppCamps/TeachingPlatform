import { createSelector } from "reselect";

import { ormSelector, newCreateOrmSelector, createOrmSelector } from "../orm";

const topicSlugSelector = (_state, slug) => slug;

export const topicBySlugSelector = newCreateOrmSelector(
  topicSlugSelector,
  ({ Topic }, slug) => Topic.get({ slug })
);

export const topicsSelector = createSelector(
  ormSelector,
  createOrmSelector((session) =>
    session.Topic.orderBy((t) => t.title.toLowerCase())
      .all()
      .toModelArray()
      .map((topic) => {
        topic.includeRef.courses = topic.courses
          .orderBy("position")
          .toModelArray()
          .map((course) => {
            course.includeRef.lessons = course.lessons
              .orderBy("position")
              .toModelArray()
              .map((lesson) => {
                lesson.includeMany({
                  relations: ["expertises"],
                  modifier: (expertise) =>
                    expertise.orderBy((exp) => exp.title.toLowerCase()),
                });
                return lesson.includeRef;
              });
            return course.includeRef;
          });
        return topic.includeRef;
      })
  )
);
