import React from "react";

import { mount, shallow } from "enzyme";
import { expect } from "../chai_helper";
import factory from "../__factories__";

import ClassLesson from "../../components/class-lesson";
import style from "../../components/class-lesson/style.scss";

import Lesson from "../../components/shared/lesson";
import NotFound from "../../components/shared/not-found";
import Button from "../../components/shared/button";

describe("<ClassLesson />", () => {
  const klass = factory.build("class", {}, { coursesCount: 0 });
  const topic = factory.build("topic", {}, { coursesCount: 0 });
  const course = factory.build("course", { topic }, { lessonsCount: 0 });
  const lesson = factory.build("lesson", { course });
  const fetchClassById = jest.fn();
  const fetchCourses = jest.fn();
  const handleBackToClasses = jest.fn();
  const markLessonAsComplete = jest.fn();
  const markLessonAsIncomplete = jest.fn();
  const courseProgress = {
    completedLessons: 3,
    totalLessons: 6,
  };

  const defaultProps = {
    class: klass,
    lesson,
    fetchClassById,
    fetchCourses,
    handleBackToClasses,
    markLessonAsComplete,
    markLessonAsIncomplete,
    courseProgress,
  };

  it("should call fetchClassById and fetchCourses on mount", () => {
    const fetchClassByIdMock = jest.fn();
    mount(
      <ClassLesson
        {...defaultProps}
        class={{ id: "fetchClassById" }}
        fetchClassById={fetchClassByIdMock}
      />,
      { context: { t: (translationString) => translationString } }
    );

    expect(fetchClassByIdMock.mock.calls[0]).to.eql(["fetchClassById"]);
    expect(fetchCourses.mock.calls[0]).to.eql([]);
  });

  it("should should give right lessonUrl parameter", () => {
    const wrapper = mount(<ClassLesson {...defaultProps} />, {
      context: { t: (translationString) => translationString },
    });
    const { lessonUrl } = wrapper.find(Lesson).props();

    expect(lessonUrl({ slug: "test" })).to.equal(
      `/classes/${klass.id}/${course.slug}/test`
    );
  });

  it("renders 404 if any record has no id", () => {
    const wrapper = shallow(
      <ClassLesson
        {...Object.assign({}, defaultProps, {
          course: { id: null, isPersisted: true },
          lesson: { id: null, isPersisted: true },
          topic: { id: null, isPersisted: true },
        })}
      />,
      { context: { t: (translationString) => translationString } }
    );

    expect(wrapper).to.contain(<NotFound />);
  });

  describe("actions", () => {
    it("should have a back button that calls handleBackToClasses", () => {
      const wrapper = mount(<ClassLesson {...defaultProps} />, {
        context: { t: (translationString) => translationString },
      });

      expect(wrapper).to.contain(
        <Button onClick={handleBackToClasses} isSecondary leftIcon="angle-left">
          back to my classes
        </Button>
      );
    });

    it("should have only a back button while loading", () => {
      const wrapper = mount(<ClassLesson {...defaultProps} class={{}} />, {
        context: { t: (translationString) => translationString },
      });

      const buttons = wrapper.find(Button);

      expect(buttons.length).to.equal(1);
      expect(buttons.at(0)).to.have.text("back to my classes");
    });

    it("should have complete lesson button and call markLessonAsComplete on click", () => {
      const markLessonAsCompleteMock = jest.fn(() => Promise.resolve());
      const wrapper = mount(
        <ClassLesson
          {...defaultProps}
          markLessonAsComplete={markLessonAsCompleteMock}
        />,
        { context: { t: (translationString) => translationString } }
      );

      const button = wrapper
        .find(`.${style.completeLessonButton}`)
        .find(Button);

      expect(button).to.have.text("Tag lesson as completed");

      button.simulate("click");

      expect(markLessonAsCompleteMock.mock.calls[0]).to.eql([klass, lesson]);
    });

    it("should have incomplete lesson link and call markLessonAsIncomplete on click", () => {
      const markLessonAsIncompleteMock = jest.fn(() => Promise.resolve());
      const newClass = { ...klass, completedLessons: [lesson.id] };
      const wrapper = mount(
        <ClassLesson
          {...defaultProps}
          markLessonAsIncomplete={markLessonAsIncompleteMock}
          class={newClass}
        />,
        { context: { t: (translationString) => translationString } }
      );

      const completedLesson = wrapper.find(`.${style.completedLesson}`);

      expect(completedLesson.childAt(0)).to.have.text(
        "This lesson was tagged as completed."
      );
      expect(completedLesson.find("a")).to.have.text("Undo");

      completedLesson.find("a").simulate("click");

      expect(markLessonAsIncompleteMock.mock.calls[0]).to.eql([
        newClass,
        lesson,
      ]);
    });

    it("should have a back button that calls handleBackToClasses", () => {
      const wrapper = mount(<ClassLesson {...defaultProps} />, {
        context: { t: (translationString) => translationString },
      });

      expect(wrapper).to.contain(
        <Button onClick={handleBackToClasses} isSecondary leftIcon="angle-left">
          back to my classes
        </Button>
      );
    });
  });

  it("should render Lesson with given props", () => {
    const wrapper = shallow(<ClassLesson {...defaultProps} />, {
      context: { t: (translationString) => translationString },
    });

    const renderedLesson = wrapper.find(Lesson);
    expect(renderedLesson).to.have.props({
      lesson,
      course,
      title: klass.name,
      courseProgress,
    });
  });

  it("should have props given props", () => {
    const wrapper = mount(<ClassLesson {...defaultProps} />, {
      context: { t: (translationString) => translationString },
    });

    expect(wrapper).to.have.props({ lesson });
    expect(wrapper.prop("fetchClassById")).to.equal(fetchClassById);
    expect(wrapper.prop("handleBackToClasses")).to.equal(handleBackToClasses);
    expect(wrapper.prop("markLessonAsComplete")).to.equal(markLessonAsComplete);
    expect(wrapper.prop("markLessonAsIncomplete")).to.equal(
      markLessonAsIncomplete
    );
  });
});
