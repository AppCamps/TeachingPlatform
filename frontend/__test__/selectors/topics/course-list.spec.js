import TestStore from "../../orm-helper";
import { coursesSelector } from "../../../selectors/topics/course-list";

describe("course list selectors", () => {
  let store;
  beforeEach(() => {
    store = new TestStore();
  });

  describe("coursesSelector", () => {
    it("returns courses for selected topic", () => {
      const { factory } = store;
      const topic = factory.create("topic");
      const courses = factory.createList("course", 2, { topic });

      const selectedCourses = coursesSelector(store.state, topic.slug);

      expect(courses).toHaveLength(2);
      expect(selectedCourses).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: courses[0].id }),
          expect.objectContaining({ id: courses[1].id }),
        ])
      );
    });
  });
});
