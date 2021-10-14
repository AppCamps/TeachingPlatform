import React from "react";
import PropTypes from "prop-types";

import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";
import get from "lodash.get";

import { mount } from "enzyme";
import { expect } from "../../../chai_helper";
import TestStore from "../../../orm-helper";
import { slugify } from "../../../../utils";

import AddCourses from "../../../../components/shared/class-form/add-courses";
import TopicSelection from "../../../../components/shared/topic-selection";

import CheckIcon from "../../../../components/shared/class-form/add-courses/icons/check";
import MinusIcon from "../../../../components/shared/class-form/add-courses/icons/minus";
import PlusIcon from "../../../../components/shared/class-form/add-courses/icons/plus";

import Course from "../../../../components/shared/course";

import Button from "../../../../components/shared/button";

import style from "../../../../components/shared/class-form/add-class-informations/style.scss";

describe("<AddCourses />", () => {
  const { factory } = new TestStore();

  const onSubmit = jest.fn();
  const previousPage = jest.fn();
  const fetchCourses = jest.fn(() => Promise.resolve({}));

  const topics = factory.buildList("topic", 2).map((topic) => {
    topic.className = slugify(topic.title);
    topic.courses = factory.buildList("course", 1).map((course) => {
      course.lessons = factory.buildList("lesson", 1).map((lesson) => {
        lesson.expertises = factory.buildList("expertise", 1);
        return lesson;
      });
      return course;
    });
    return topic;
  });

  const defaultProps = {
    onSubmit,
    previousPage,
    fetchCourses,
    formValues: {},
    topics,
  };

  const middlewares = combineReducers({ form: formReducer });
  const store = createStore(middlewares);

  const setupWrapper = (props = {}) => {
    const componentProps = Object.assign({}, defaultProps, props);

    const TestComponent = (_props) => (
      <Provider store={store}>
        <div>
          <AddCourses {...{ ...componentProps, ..._props }} />
        </div>
      </Provider>
    );

    const component = <TestComponent {...componentProps} />;

    return mount(component, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: {
        t: PropTypes.func,
      },
    });
  };

  it("renders all topic buttons and courses", () => {
    const wrapper = setupWrapper({ submitText: "Create class" }).find(
      AddCourses
    );

    expect(
      wrapper.containsMatchingElement(
        <TopicSelection topics={topics} selectedTopic={topics[0]} />
      )
    ).to.be.true;

    expect(
      wrapper.containsAllMatchingElements([
        <Course topic={topics[0]} course={topics[0].courses[0]} />,
        <Course topic={topics[1]} course={topics[1].courses[0]} />,
      ])
    );

    const buttons = wrapper.find(`.${style.actions}`);
    expect(buttons.childAt(0).find(Button)).to.have.text("Create class");
    expect(buttons.childAt(0).find(Button).prop("type")).to.equal("submit");
    expect(buttons.childAt(1).find(Button)).to.have.text("Back");
  });

  it("selects course on click", () => {
    const wrapper = setupWrapper();
    const courseButton = wrapper
      .find(`.${style.addCourseButtonContainer}`)
      .at(0);

    expect(courseButton).to.have.text("add");
    expect(courseButton).to.contain(<PlusIcon color={topics[0].color} />);

    let formValuesState = get(store.getState(), "form.classForm.values");
    expect(formValuesState).not.to.be;

    wrapper.find(Course).first().simulate("click");

    formValuesState = get(store.getState(), "form.classForm.values");
    expect(formValuesState.courses).to.deep.eql([topics[0].courses[0].id]);

    wrapper.setProps({ formValues: formValuesState });
    expect(
      wrapper.find(`.${style.addCourseButtonContainer}`).at(0)
    ).to.have.text("added");
  });

  /*
    TODO: simulate('mouseenter') does not work in enzyme 3 atm
    https://github.com/airbnb/enzyme/issues/1201
  */
  it.skip("deselects course on click", () => {
    const course = topics[0].courses[0];

    const wrapper = setupWrapper({
      formValues: {
        courses: [course.id],
      },
    });

    const firstCourseElement = wrapper.find("span").at(0);
    const courseButton = firstCourseElement.find(
      `.${style.addCourseButtonContainer}`
    );

    expect(courseButton).to.have.text("added");
    expect(courseButton).to.contain(<CheckIcon color={topics[0].color} />);
    firstCourseElement.simulate("mouseEnter");
    expect(courseButton).to.contain(<MinusIcon color={topics[0].lightColor} />);
    expect(
      courseButton.find(`.${style.addCourseButtonContainer}`)
    ).to.have.text("remove");

    firstCourseElement.simulate("click");
    const formValuesState = get(store.getState(), "form.classForm.values");
    expect(formValuesState.courses).to.eql([]);
  });

  it("renders other courses on filterButton click", () => {
    const wrapper = setupWrapper();

    expect(
      wrapper.containsMatchingElement(<Course course={topics[0].courses[0]} />)
    ).to.equal(true);
    expect(
      wrapper.containsMatchingElement(<Course course={topics[1].courses[0]} />)
    ).to.equal(false);

    wrapper.find(`.${style.topicFilters} Button`).at(1).simulate("click");

    expect(
      wrapper.containsMatchingElement(<Course course={topics[1].courses[0]} />)
    ).to.equal(true);
    expect(
      wrapper.containsMatchingElement(<Course course={topics[0].courses[0]} />)
    ).to.equal(false);
  });

  describe("`Create class` Button", () => {
    it("it calls onSubmit for when required fields are filled", (done) => {
      const wrapper = setupWrapper().find(AddCourses);

      wrapper.find(`.${style.nextButton} button`).simulate("click");

      setTimeout(() => {
        expect(onSubmit.mock.calls.length).to.equal(1);
        done();
      }, 0);
    });
  });

  describe("Back Button", () => {
    it("it calls previousPage on backButton click", (done) => {
      const wrapper = setupWrapper().find(AddCourses);

      wrapper.find(`.${style.backButton} button`).simulate("click");

      setTimeout(() => {
        expect(previousPage.mock.calls.length).to.equal(1);
        done();
      }, 0);
    });
  });
});
