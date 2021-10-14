import { createSelector } from "reselect";

import { topicBySlugSelector } from "../shared/topic";

export { topicBySlugSelector };

export const coursesSelector = createSelector(
  [topicBySlugSelector],
  (selectedTopic) =>
    selectedTopic.courses
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
      })
);
