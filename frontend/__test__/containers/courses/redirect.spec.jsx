import React from "react";
import { replace } from "react-router-redux";
import { shallow } from "enzyme";

import TestStore from "../../orm-helper";
import {
  CourseLessonRedirect,
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/courses/redirect";

describe("Courses/Redirect Container + Component", () => {
  describe("mapStateToProps", () => {
    let store;
    beforeEach(() => {
      store = new TestStore();
    });

    it("returns slug of topic, course and lesson", () => {
      const { factory } = store;
      const topic = factory.create("topic");
      const course = factory.create("course", { topic }, { lessonsCount: 1 });

      const { topicSlug, courseSlug, lessonSlug } = mapStateToProps(
        store.state,
        {
          params: { courseSlug: course.slug, lessonSlug: "lesson-slug" },
        }
      );

      expect(topicSlug).toEqual(course.topic.slug);
      expect(courseSlug).toEqual(course.slug);
      expect(lessonSlug).toEqual("lesson-slug");
    });
  });

  describe("mapDispatchToProps", () => {
    it("fetchCourses", () => {
      const fetchCourses = jest.fn();
      containerRewire.__Rewire__("fetchCoursesAction", fetchCourses);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.fetchCourses();

      expect(fetchCourses.mock.calls).toHaveLength(1);
      expect(fetchCourses.mock.calls[0]).toEqual([]);
    });

    it("redirect", () => {
      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const topicSlug = "topicSlug";
      const courseSlug = "courseSlug";
      const lessonSlug = "lessonSlug";

      const result = actions.redirect(topicSlug, courseSlug, lessonSlug);

      expect(result).toEqual(
        replace(`/topics/${topicSlug}/${courseSlug}/${lessonSlug}`)
      );
    });
  });

  describe("Component", () => {
    function defaultProps() {
      return {
        courseSlug: "courseSlug",
        lessonSlug: "lessonSlug",
        fetchCourses: jest.fn(),
        redirect: jest.fn(),
      };
    }

    it("fetches courses if topicSlug is absent", () => {
      const props = { ...defaultProps() };
      const { fetchCourses, redirect } = props;

      expect(props.topicSlug).toBeUndefined();

      const wrapper = shallow(<CourseLessonRedirect {...props} />);

      expect(wrapper.contains(<div />)).toEqual(true);

      expect(fetchCourses.mock.calls).toHaveLength(1);
      expect(fetchCourses.mock.calls[0]).toEqual([]);
      expect(redirect.mock.calls).toHaveLength(0);
    });

    it("redirects to new url if topicSlug is present", () => {
      const props = defaultProps();
      const { fetchCourses, redirect } = props;

      const wrapper = shallow(<CourseLessonRedirect {...props} />);

      expect(fetchCourses.mock.calls).toHaveLength(1);
      expect(redirect.mock.calls).toHaveLength(0);

      wrapper.setProps({ ...props, topicSlug: "topicSlug" });

      expect(redirect.mock.calls).toHaveLength(1);
      expect(redirect.mock.calls[0]).toEqual([
        "topicSlug",
        "courseSlug",
        "lessonSlug",
      ]);
    });
  });
});
