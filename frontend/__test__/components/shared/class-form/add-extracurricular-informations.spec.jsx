import React from "react";
import PropTypes from "prop-types";

import { createStore, combineReducers } from "redux";
import { Field, reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";

import { mount } from "enzyme";
import { expect } from "../../../chai_helper";

import AddExtracurricularInformations, {
  validate,
  __RewireAPI__ as RewireAPI,
} from "../../../../components/shared/class-form/add-extracurricular-informations";

import InputWithLabel from "../../../../components/shared/input-with-label";
import TextareaWithLabel from "../../../../components/shared/textarea-with-label";
import Button from "../../../../components/shared/button";

import style from "../../../../components/shared/class-form/add-class-informations/style.scss";

describe("<AddExtracurricularInformations />", () => {
  let onSubmitCallCount = 0;
  const onSubmit = () => {
    onSubmitCallCount += 1;
  };

  let previousPageCallCount = 0;
  const previousPage = () => {
    previousPageCallCount += 1;
  };

  const formValues = {};
  const defaultProps = {
    onSubmit,
    previousPage,
    formValues,
  };
  const store = createStore(combineReducers({ form: formReducer }));

  const wrapComponent = (component) => (
    <Provider store={store}>{component}</Provider>
  );

  const setupWrapper = (props = {}) => {
    const component = wrapComponent(
      <AddExtracurricularInformations {...{ ...defaultProps, ...props }} />
    );
    return mount(component, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: { t: PropTypes.func },
    }).find(AddExtracurricularInformations);
  };

  beforeEach(() => {
    onSubmitCallCount = 0;
    previousPageCallCount = 0;
  });

  it("renders all fields and buttons", () => {
    const isInRange0To999 = jest.fn();
    const isInRange = () => isInRange0To999;
    RewireAPI.__Rewire__("isInRange", isInRange);

    const wrapper = setupWrapper({ formValues: { year: "2016" } });
    RewireAPI.__ResetDependency__("isInRange");

    expect(
      wrapper.containsMatchingElement(
        <Field
          name="groupName"
          label="Group name"
          component={InputWithLabel}
          required
        />
      )
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field name="year" label="Year" component={InputWithLabel} required />
      )
    ).to.be.true;

    expect(
      wrapper.containsMatchingElement(
        <Field name="age" label="Age" component={InputWithLabel} />
      )
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="girlCount"
          label="Girl count"
          normalize={isInRange0To999}
          component={InputWithLabel}
        />
      )
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="boyCount"
          label="Boy count"
          normalize={isInRange0To999}
          component={InputWithLabel}
        />
      )
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="plannedExtracurricularUsage"
          label="In what setting will you teach the courses?"
          component={TextareaWithLabel}
        />
      )
    ).to.be.true;

    expect(wrapper.find(Button)).to.have.length(2);

    const buttons = wrapper.find(`.${style.actions}`);
    expect(buttons.childAt(0).find(Button)).to.have.text("Next");
    expect(buttons.childAt(0).find(Button).prop("type")).to.equal("submit");
    expect(buttons.childAt(1).find(Button)).to.have.text("Back");
  });

  it("prefills year", () => {
    const currentYear = new Date().getFullYear().toString();

    const wrapper = setupWrapper();
    const yearInput = wrapper.find(`.${style.year} input`);

    expect(yearInput.prop("value")).to.equal(currentYear);
  });

  describe("Next Button", () => {
    it("it calls onSubmit for when required fields are filled", () => {
      const wrapper = setupWrapper();

      wrapper.find(`.${style.groupName} input`).simulate("change", {
        target: { value: "Pfadfinderlage" },
      });
      wrapper.find(`.${style.year} input`).simulate("change", {
        target: { value: "1971" },
      });

      wrapper.find("form").simulate("submit");

      const state = store.getState().form.classForm.values;
      expect(state.groupName).to.equal("Pfadfinderlage");
      expect(state.year).to.equal("1971");
      expect(onSubmitCallCount).to.equal(1);
    });
  });

  describe("#validate", () => {
    it("requires groupName and year", () => {
      const errors = validate({});

      expect(errors).to.deep.eql({
        groupName: "Required",
        year: "Required",
      });
    });
  });

  describe("Back Button", () => {
    it("it calls previousPage on backButton click", () => {
      const wrapper = setupWrapper();

      wrapper.find(`.${style.backButton} button`).simulate("click");

      expect(previousPageCallCount).to.equal(1);
    });
  });
});
