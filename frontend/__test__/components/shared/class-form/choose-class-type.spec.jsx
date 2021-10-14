import React from "react";
import PropTypes from "prop-types";

import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";
import get from "lodash.get";

import { mount } from "enzyme";
import { expect } from "../../../chai_helper";

import ChooseClassTypeComponent from "../../../../components/shared/class-form/choose-class-type";

import style from "../../../../components/shared/class-form/choose-class-type/style.scss";

describe("<ChooseClassTypeComponent />", () => {
  let callCount = 0;
  const onSubmit = () => {
    callCount += 1;
  };
  const defaultProps = {
    onSubmit,
    formValues: {},
  };
  const store = createStore(combineReducers({ form: formReducer }));

  const wrapComponent = (component) => (
    <Provider store={store}>{component}</Provider>
  );

  const setupWrapper = () => {
    const component = wrapComponent(
      <ChooseClassTypeComponent {...Object.assign({}, defaultProps)} />
    );
    return mount(component, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: { t: PropTypes.func },
    }).find(`.${style.chooseClassType}`);
  };

  beforeEach(() => {
    callCount = 0;
  });

  it("renders a school_class and an extracurricular button", () => {
    const wrapper = setupWrapper();

    expect(
      wrapper.containsMatchingElement(<button>School class</button>)
    ).to.equal(true);
    expect(
      wrapper.containsMatchingElement(<button>Extracurricular</button>)
    ).to.equal(true);
  });

  it("sets type to school_class and calls onSubmit on School class button click", (done) => {
    const wrapper = setupWrapper();
    wrapper
      .find("Button")
      .filterWhere((button) => button.text() === "School class")
      .simulate("click");

    const state = store.getState();
    expect(get(state, "form.classForm.values.resourceType")).to.equal(
      "school_class"
    );
    setTimeout(() => {
      expect(callCount).to.equal(1);
      done();
    }, 0);
  });

  it("sets type to extracurricular and calls onSubmit on Extracurricular button click", (done) => {
    const wrapper = setupWrapper();
    wrapper
      .find("button")
      .filterWhere((button) => button.text() === "Extracurricular")
      .simulate("click");

    const state = store.getState();
    expect(get(state, "form.classForm.values.resourceType")).to.equal(
      "extracurricular"
    );
    setTimeout(() => {
      expect(callCount).to.equal(1);
      done();
    }, 0);
  });
});
