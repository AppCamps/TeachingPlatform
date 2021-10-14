import React from "react";

import reactParser from "html-react-parser";

import { mount } from "enzyme";
import { expect } from "../../chai_helper";
import factory from "../../__factories__";

import Lesson from "../../../components/shared/lesson";
import TeachingMaterial from "../../../components/shared/lesson/teaching-material";
import Title from "../../../components/shared/title";
import FaIcon from "../../../components/shared/fa-icon";

import style from "../../../components/shared/lesson/style.scss";

describe("<Lesson/>", () => {
  const lesson = factory.build("lesson", { slug: "test" });
  const course = factory.build("course", {
    lessons: [lesson],
    topic: factory.build("topic"),
  });
  const fetchCoursesBySlug = () => true;
  const handleBackToCourses = () => true;

  const defaultProps = {
    course,
    lesson,
    fetchCoursesBySlug,
    handleBackToCourses,
    title: "Test title",
    lessonUrl: (_lesson) => `/${course.slug}/${_lesson.slug}`,
    prevLesson: null,
    nextLesson: null,
  };

  it("should contain headings and description", () => {
    const wrapper = mount(<Lesson {...defaultProps} />, {
      context: { t: (translationString) => translationString },
    });

    expect(wrapper.containsMatchingElement(<h1>Test title</h1>)).to.eql(true);
    expect(
      wrapper.containsMatchingElement(<h2>{course.topic.title}</h2>)
    ).to.eql(true);
    expect(
      wrapper.containsMatchingElement(
        <h3>{`${course.title} - ${lesson.title}`}</h3>
      )
    ).to.eql(true);
    expect(wrapper).to.contain(
      <div className={style.lessonDescription}>
        {reactParser(lesson.description)}
      </div>
    );
  });

  it("should include course progress in title if given", () => {
    const t = jest.fn((_t) => _t);
    const params = { completedLessons: 4, totalLessons: 7 };

    const wrapper = mount(
      <Lesson {...defaultProps} courseProgress={params} />,
      { context: { t } }
    );

    expect(t.mock.calls[0]).to.deep.equal([
      "completed {completedLessons} of {totalLessons} lessons",
      params,
    ]);

    expect(wrapper.find("h1")).to.have.text(
      "Test title(completed {completedLessons} of {totalLessons} lessons)"
    );
  });

  describe("lesson navigation", () => {
    describe("nextLesson", () => {
      it("should not render link when nextLesson is null", () => {
        const wrapper = mount(<Lesson {...defaultProps} nextLesson={null} />, {
          context: { t: (translationString) => translationString },
        });
        expect(wrapper.find(`.${style.lessonNavigation}`)).not.to.have.text(
          "next lesson"
        );
      });

      it("should render link with lessonUrl when nextLesson is given", () => {
        const wrapper = mount(
          <Lesson
            {...defaultProps}
            prevLesson={null}
            nextLesson={factory.build("lesson", { slug: "nextLesson" })}
          />,
          { context: { t: (translationString) => translationString } }
        );
        const nextLessonLink = wrapper.find(`.${style.lessonNavigation} Link`);
        expect(nextLessonLink).to.have.length(1);
        expect(nextLessonLink).to.have.text("next lesson");
        expect(nextLessonLink).to.have.prop("to", `/${course.slug}/nextLesson`);
      });
    });

    describe("prevLesson", () => {
      it("should not render link when prevLesson is null", () => {
        const wrapper = mount(<Lesson {...defaultProps} prevLesson={null} />, {
          context: { t: (translationString) => translationString },
        });
        expect(wrapper.find(`.${style.lessonNavigation}`)).not.to.have.text(
          "previous lesson"
        );
      });

      it("should render link with lessonUrl when prevLesson is given", () => {
        const wrapper = mount(
          <Lesson
            {...defaultProps}
            prevLesson={factory.build("lesson", { slug: "prevLesson" })}
            nextLesson={null}
          />,
          { context: { t: (translationString) => translationString } }
        );
        const prevLessonLink = wrapper.find(`.${style.lessonNavigation} Link`);
        expect(prevLessonLink).to.have.length(1);
        expect(prevLessonLink).to.have.text("previous lesson");
        expect(prevLessonLink).to.have.prop("to", `/${course.slug}/prevLesson`);
      });
    });
  });

  describe("teachingMaterials", () => {
    describe("lessonContent === true", () => {
      it("renders list of teachingMaterials", () => {
        const teachingMaterial = factory.build("teachingMaterial");

        const lessonWithTeachingMaterial = {
          ...lesson,
          teachingMaterials: [teachingMaterial],
        };

        const wrapper = mount(
          <Lesson {...defaultProps} lesson={lessonWithTeachingMaterial} />,
          {
            context: { t: (translationString) => translationString },
          }
        );

        expect(wrapper).to.contain(<Title>Lesson content</Title>);

        expect(wrapper).to.contain(
          <TeachingMaterial teachingMaterial={teachingMaterial} number={1} />
        );
      });
    });

    describe("listingItem === true", () => {
      it("does not include icon if it is empty", () => {
        const lessonHintMaterial = factory.build("teachingMaterial", {
          listingItem: true,
          listingTitle: "lessonHintMaterial",
          listingIcon: "",
          position: 0,
        });

        const wrapper = mount(
          <Lesson
            {...defaultProps}
            lesson={{ ...lesson, teachingMaterials: [lessonHintMaterial] }}
          />,
          { context: { t: (translationString) => translationString } }
        );

        expect(wrapper).to.contain(<Title>Lesson links & hints</Title>);
        expect(wrapper).not.to.contain(
          <span className={style.lessonHintIcon}>
            <FaIcon icon={lessonHintMaterial.listingIcon} />
          </span>
        );
      });

      it("renders list of teachingMaterials", () => {
        const lessonHintMaterial = factory.build("teachingMaterial", {
          listingItem: true,
          listingTitle: "lessonHintMaterial",
          listingIcon: "attachment",
          position: 0,
        });
        const notRenderedMaterial = factory.build("teachingMaterial", {
          listingItem: false,
          position: 1,
        });

        const wrapper = mount(
          <Lesson
            {...defaultProps}
            lesson={{
              ...lesson,
              teachingMaterials: [lessonHintMaterial, notRenderedMaterial],
            }}
          />,
          { context: { t: (translationString) => translationString } }
        );

        expect(wrapper).to.contain(<Title>Lesson links & hints</Title>);
        expect(wrapper).to.contain(
          <FaIcon icon={lessonHintMaterial.listingIcon} />
        );

        expect(wrapper).to.contain(
          <dfn>{lessonHintMaterial.listingTitle}</dfn>
        );
        expect(wrapper).to.contain(
          <a
            href={lessonHintMaterial.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {lessonHintMaterial.link}
          </a>
        );

        expect(wrapper).not.to.contain(
          <dfn>{notRenderedMaterial.listingTitle}</dfn>
        );
      });
    });
  });

  describe("commonMistakes", () => {
    it("renders list of commonMistakes", () => {
      const commonMistake1 = factory.build("commonMistake", {
        id: "1",
        problem: "noen",
        solution: "jee",
      });
      const commonMistake2 = factory.build("commonMistake", {
        id: "2",
        problem: "noen2",
        solution: "jee2",
      });

      const wrapper = mount(
        <Lesson
          {...defaultProps}
          lesson={{
            ...lesson,
            commonMistakes: [commonMistake1, commonMistake2],
          }}
        />,
        { context: { t: (translationString) => translationString } }
      );

      expect(wrapper.find(`.${style.lessonInfoContainer}`)).to.contain(
        <Title>Lesson links & hints</Title>
      );
      expect(wrapper.find(`.${style.lessonInfoContainer}`)).to.contain(
        <FaIcon icon="exclamation-triangle" />
      );
      expect(wrapper.find(`.${style.lessonInfoContainer}`)).to.contain(
        <dfn>Common mistakes</dfn>
      );

      expect(
        wrapper.find(`.${style.lessonCommonMistakeProblem}`).first()
      ).to.have.text(commonMistake1.problem);
      expect(
        wrapper.find(`.${style.lessonCommonMistakeSolution}`).first()
      ).to.have.text(commonMistake1.solution);

      expect(
        wrapper.find(`.${style.lessonCommonMistakeProblem}`).last()
      ).to.have.text(commonMistake2.problem);
      expect(
        wrapper.find(`.${style.lessonCommonMistakeSolution}`).last()
      ).to.have.text(commonMistake2.solution);
    });
  });

  it("should have props given props", () => {
    const wrapper = mount(<Lesson {...Object.assign({}, defaultProps)} />, {
      context: { t: (translationString) => translationString },
    });

    expect(wrapper.prop("course")).to.equal(course);
    expect(wrapper.prop("lesson")).to.equal(lesson);
    expect(wrapper.prop("fetchCoursesBySlug")).to.equal(fetchCoursesBySlug);
    expect(wrapper.prop("handleBackToCourses")).to.equal(handleBackToCourses);
  });
});
