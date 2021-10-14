import { expect } from "../chai_helper";
import TestStore from "../orm-helper";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../containers/classes";
import { initialState } from "../../reducers/classes";

describe("Classes Container", () => {
  describe("mapStateToProps", () => {
    let store;
    beforeEach(() => {
      store = new TestStore({ classes: initialState });
    });

    describe("classes", () => {
      it("includes courses and courseSchoolClass in classes", () => {
        const {
          session: { Course },
          factory,
          state,
        } = store;
        const klass = factory.create("schoolClass", {}, { coursesCount: 0 });
        const courses = factory.createList(
          "course",
          2,
          {},
          { lessonsCount: 0 }
        );
        klass.update({ courses: courses.map((c) => c.id) });

        const orderedCoursesRef = Course.all()
          .orderBy("position")
          .toModelArray()
          .map((course) => {
            course.includeFk("topic");
            course.includeRef.courseSchoolClass =
              course.courseSchoolClasses.first().includeRef;
            course.includeMany({ relations: ["lessons"] });
            return course.includeRef;
          });
        const props = mapStateToProps(state);

        const coursesRef = props.classes[0].courses;

        expect(coursesRef).to.have.length(2);
        coursesRef.forEach((courseRef, index) => {
          expect(courseRef).to.deep.equal(orderedCoursesRef[index]);
        });
      });

      it("includes lessons with expertises in courses", () => {
        const {
          session: { Lesson },
          factory,
          state,
        } = store;
        const klass = factory.create("schoolClass", {}, { coursesCount: 0 });
        const course = factory.create(
          "course",
          { class: klass },
          { lessonsCount: 0 }
        );
        const lessons = factory.createList(
          "lesson",
          2,
          { course },
          { expertisesCount: 3 }
        );

        klass.update({ courses: [course.id] });
        course.update({ lessons: lessons.map((c) => c.id) });

        const orderedCoursesRef = Lesson.all()
          .orderBy("position")
          .toModelArray()
          .map((lesson) => {
            lesson.includeMany({
              relations: ["expertises"],
              modifier: (rel) => rel.orderBy((exp) => exp.title.toLowerCase()),
            });
            return lesson.includeRef;
          });

        const props = mapStateToProps(state);

        const lessonsRef = props.classes[0].courses[0].lessons;
        expect(lessonsRef).to.have.length(2);
        expect(lessonsRef[0].expertises).to.have.length(3);
        lessonsRef.forEach((courseRef, index) => {
          expect(courseRef).to.deep.equal(orderedCoursesRef[index]);
        });
      });

      it("includes continueLesson in course", () => {
        const {
          session: { Lesson },
          factory,
          state,
        } = store;
        const klass = factory.create("schoolClass", {}, { coursesCount: 0 });
        const course = factory.create(
          "course",
          { class: klass },
          { lessonsCount: 0 }
        );
        const lessons = factory.createList(
          "lesson",
          2,
          { course },
          { expertisesCount: 0 }
        );

        klass.update({
          courses: [course.id],
          completedLessons: [lessons[0].id],
        });
        course.update({ lessons: lessons.map((c) => c.id) });

        const lessonsRef = Lesson.all()
          .orderBy("position")
          .toModelArray()
          .map((lesson) => {
            lesson.includeFk("course");
            return lesson.includeRef;
          });

        const props = mapStateToProps(state);

        const continueLesson = props.classes[0].continueLesson;
        expect(continueLesson).to.be.ok;
        expect(continueLesson).to.deep.equal(lessonsRef[1]);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("fetchClasses", () => {
      const fetchClasses = () => "fetchClasses";
      containerRewire.__Rewire__("fetchClasses", fetchClasses);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      expect(actions.fetchClasses()).to.equal("fetchClasses");
    });

    it("setShowAll", () => {
      const showAllClasses = jest.fn();
      containerRewire.__Rewire__("showAllClasses", showAllClasses);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.setShowAll();

      expect(showAllClasses.mock.calls).to.have.length(1);
      expect(showAllClasses.mock.calls[0]).to.eql([]);
    });

    it("setShowTop", () => {
      const showTopClasses = jest.fn();
      containerRewire.__Rewire__("showTopClasses", showTopClasses);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.setShowTop();

      expect(showTopClasses.mock.calls).to.have.length(1);
      expect(showTopClasses.mock.calls[0]).to.eql([]);
    });

    it("toggleClass", () => {
      const toggleClass = jest.fn();
      containerRewire.__Rewire__("toggleClass", toggleClass);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const klass = {};
      actions.toggleClass(klass);

      expect(toggleClass.mock.calls).to.have.length(1);
      expect(toggleClass.mock.calls[0]).to.eql([klass]);
    });
  });
});
