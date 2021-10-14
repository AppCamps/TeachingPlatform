import { createSelector } from "reselect";

import { ormSelector, createOrmSelector } from "./orm";

export const classVisibilitySelector = ({ classes: { showAll } }) => showAll;
export const openClassIdsSelector = ({ classes: { openedClassIds } }) =>
  openedClassIds;

function includeFirstIncompleteLesson(Lesson, completedLessons, courses) {
  if (!courses) {
    return null;
  }
  const lessons = courses.reduce(
    (memo, course) => memo.concat(course.lessons),
    []
  );
  const incompleteLesson = lessons.find(
    (lesson) => completedLessons.indexOf(lesson.id) === -1
  );
  if (incompleteLesson) {
    const lesson = Lesson.withId(incompleteLesson.id);
    lesson.includeFk("course");
    return lesson.includeRef;
  }
  return null;
}

export const classesSelector = createSelector(
  ormSelector,
  createOrmSelector((session) => {
    const { Class } = session;
    return Class.all()
      .toModelArray()
      .map((klass) => {
        klass.includeRef.courses = klass.courses
          .orderBy("position")
          .toModelArray()
          .map((course) => {
            course.includeFk("topic");
            course.includeMany({
              relations: ["lessons"],
              modifier: (rel) => rel.orderBy("position"),
            });
            course.includeRef.lessons = course.lessons
              .orderBy("position")
              .toModelArray()
              .map((lesson) => {
                lesson.includeMany({
                  relations: ["expertises"],
                  modifier: (rel) =>
                    rel.orderBy((ref) => ref.title.toLowerCase()),
                });
                return lesson.includeRef;
              });
            const courseSchoolClass = course.courseSchoolClasses
              .filter({ schoolClass: klass.id })
              .first();
            course.includeRef.courseSchoolClass =
              courseSchoolClass && courseSchoolClass.includeRef;
            return course.includeRef;
          });
        klass.includeRef.continueLesson = includeFirstIncompleteLesson(
          session.Lesson,
          klass.completedLessons,
          klass.includeRef.courses
        );
        return klass.includeRef;
      });
  })
);
