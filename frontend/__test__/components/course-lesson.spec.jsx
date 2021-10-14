import React from "react";

import { mount } from "enzyme";
import { expect } from "../chai_helper";
import factory from "../__factories__";

import NotFound from "../../components/shared/not-found";
import CourseLesson from "../../components/course-lesson";
import Lesson from "../../components/shared/lesson";
import Link from "../../components/shared/link";

describe("<CourseLesson/>", () => {
  const topic = factory.build("topic", {
    coursesCount: 0,
    preparationMaterialsCount: 0,
  });
  const course = factory.build("course", { topic });
  const lesson = factory.build("lesson", { course });
  const fetchCourses = () => true;
  const handleBackToCourses = () => true;

  const defaultProps = {
    lesson,
    fetchCourses,
    handleBackToCourses,
  };

  it("should call fetchCourses on mount", () => {
    const fetchCoursesMock = jest.fn();
    mount(
      <CourseLesson
        {...defaultProps}
        courseSlug={"fetchCourses"}
        fetchCourses={fetchCoursesMock}
      />,
      { context: { t: (translationString) => translationString } }
    );

    expect(fetchCoursesMock.mock.calls[0]).to.eql(["fetchCourses"]);
  });

  it("should should give right lessonUrl parameter", () => {
    const wrapper = mount(
      <CourseLesson {...defaultProps} topicSlug="topic-test" />,
      {
        context: { t: (translationString) => translationString },
      }
    );
    const { lessonUrl } = wrapper.find(Lesson).props();

    expect(lessonUrl({ slug: "test" })).to.equal(
      `/topics/topic-test/${course.slug}/test`
    );
  });

  it("renders 404 if any record has no id", () => {
    const wrapper = mount(
      <CourseLesson
        {...defaultProps}
        course={{ id: null, isPersisted: true }}
        lesson={{ id: null, isPersisted: true }}
      />,
      { context: { t: (translationString) => translationString } }
    );

    expect(wrapper).to.contain(<NotFound />);
  });

  describe("actions", () => {
    it("should have a back button that calls handleBackToCourses", () => {
      const handleBackToCoursesMock = jest.fn();
      const wrapper = mount(
        <CourseLesson
          {...defaultProps}
          topicSlug="topic-test-slug"
          handleBackToCourses={handleBackToCoursesMock}
        />,
        { context: { t: (translationString) => translationString } }
      );

      const button = wrapper.find(Link);

      expect(button).to.have.text("back to course overview");
      expect(button).to.have.props({
        button: true,
        isSecondary: true,
        leftIcon: "angle-left",
        to: "/topics/topic-test-slug",
      });
    });
  });

  it("should render Lesson with given props", () => {
    const wrapper = mount(<CourseLesson {...defaultProps} />, {
      context: { t: (translationString) => translationString },
    });

    const renderedLesson = wrapper.find("Lesson");
    expect(renderedLesson).to.have.props({
      lesson,
      course,
      title: "Course preview",
    });
  });

  it("should have props given props", () => {
    const wrapper = mount(
      <CourseLesson {...Object.assign({}, defaultProps)} />,
      {
        context: { t: (translationString) => translationString },
      }
    );

    expect(wrapper.prop("lesson")).to.equal(lesson);
    expect(wrapper.prop("fetchCourses")).to.equal(fetchCourses);
    expect(wrapper.prop("handleBackToCourses")).to.equal(handleBackToCourses);
  });
});
