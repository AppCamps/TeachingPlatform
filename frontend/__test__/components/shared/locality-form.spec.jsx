import React from "react";
import PropTypes from "prop-types";

import { createStore, combineReducers } from "redux";
import { Field, reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";

import { mount } from "enzyme";
import { expect } from "../../chai_helper";
import TestStore from "../../orm-helper";

import { constants } from "../../../config";

import LocalityForm from "../../../components/login/locality";

import InputWithLabel from "../../../components/shared/input-with-label";
import SelectWithLabel from "../../../components/shared/select-with-label";
import Button from "../../../components/shared/button";

import style from "../../../components/login/locality/style.scss";

const primaryCountries = constants.PRIMARY_COUNTRIES;

describe("<LocalityForm />", () => {
  const store = createStore(combineReducers({ form: formReducer }));

  const { factory } = new TestStore(store.getState());

  const createLocality = () => Promise.resolve();
  const fetchCountries = () => Promise.resolve();
  const formValues = {};
  const user = factory.build("user", { locality: false });
  const defaultProps = {
    createLocality,
    fetchCountries,
    formValues,
    user,
    stateOptions: [{ 0: "state" }],
  };

  const wrapComponent = (component) => (
    <Provider store={store}>{component}</Provider>
  );

  const setupWrapper = (props = {}) => {
    const component = wrapComponent(
      <LocalityForm {...{ ...defaultProps, ...props }} />
    );
    return mount(component, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: { t: PropTypes.func },
    });
  };

  const changeInput = (wrapper, name, value) => {
    const field = wrapper
      .find("Field")
      .filterWhere((c) => c.prop("name") === name);

    if (field.length === 0) {
      throw new Error(`Cannot find input: ${name}`);
    }

    if (field.prop("component") === SelectWithLabel) {
      field.find("Select").prop("onChange")(value);
    } else {
      field.find("input").simulate("change", { target: { value } });
    }
  };

  describe("fields and submit", () => {
    it("renders form role_teacher", () => {
      const wrapper = setupWrapper({ user: { ...user, teacher: true } });

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="schoolType"
            label="School type"
            component={SelectWithLabel}
            required
          />
        )
      ).to.be.true;

      expect(
        wrapper.containsMatchingElement(
          <Field name="schoolTypeCustom" type="hidden" component="input" />
        )
      ).to.be.true;
      expect(
        wrapper.containsMatchingElement(
          <Field
            name="schoolName"
            label="School name"
            component={InputWithLabel}
          />
        )
      ).to.be.true;
      expect(
        wrapper.containsMatchingElement(
          <Field
            name="subjects"
            label="Subjects"
            component={InputWithLabel}
            required
          />
        )
      ).to.be.true;

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="country"
            label="Country"
            component={SelectWithLabel}
            required
          />
        )
      ).to.be.true;

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="postalCode"
            label="Postal code"
            component={InputWithLabel}
          />
        )
      ).to.be.true;

      expect(
        wrapper.containsMatchingElement(
          <Field name="city" label="City" component={InputWithLabel} />
        )
      ).to.be.true;

      const button = wrapper.find(Button);
      expect(button).to.have.length(1);
      expect(button).to.have.text("Save");
    });

    it("only renders non-school fields for !role_teacher", () => {
      const wrapper = setupWrapper({ user: { ...user, teacher: false } });

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="schoolType"
            label="School type"
            component={SelectWithLabel}
            required
          />
        )
      ).to.be.false;

      expect(
        wrapper.containsMatchingElement(
          <Field name="schoolTypeCustom" type="hidden" component="input" />
        )
      ).to.be.false;
      expect(
        wrapper.containsMatchingElement(
          <Field
            name="schoolName"
            label="School name"
            component={InputWithLabel}
            required
          />
        )
      ).to.be.false;

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="country"
            label="Country"
            component={SelectWithLabel}
            required
          />
        )
      ).to.be.true;

      expect(
        wrapper.containsMatchingElement(
          <Field
            name="postalCode"
            label="Postal code"
            component={InputWithLabel}
          />
        )
      ).to.be.true;
      expect(
        wrapper.containsMatchingElement(
          <Field name="city" label="City" component={InputWithLabel} />
        )
      ).to.be.true;
      expect(
        wrapper.containsMatchingElement(
          <Field
            name="subjects"
            label="Profession / professional background"
            component={InputWithLabel}
            required
          />
        )
      ).to.be.true;

      const button = wrapper.find(Button);
      expect(button).to.have.length(1);
      expect(button).to.have.text("Save");
    });

    it("renders state dropdown if selectedCountry", () => {
      const country = factory.build("country");

      const wrapper = setupWrapper({
        user: { ...user, teacher: false },
        countries: [country],
        selectedCountry: country,
      });

      expect(wrapper.find(`.${style.state} Field`)).to.have.props({
        name: "state",
        component: SelectWithLabel,
      });
    });
  });

  describe("Form Validations", () => {
    describe("teacher", () => {
      it("requires teacher props and other fields", () => {
        const wrapper = setupWrapper({ user: { ...user, teacher: true } });

        wrapper.find("form").simulate("submit");

        expect(wrapper.find("Error")).to.have.length(4);

        expect(wrapper.find(`.${style.schoolType} Error`)).to.have.text(
          "Required"
        );
        expect(wrapper.find(`.${style.schoolSubjects} Error`)).to.have.text(
          "Required"
        );

        expect(wrapper.find(`.${style.country} Error`)).to.have.text(
          "Required"
        );
        expect(wrapper.find(`.${style.state} Error`)).to.have.text("Required");
      });
    });

    describe("!teacher", () => {
      it("requires other fields", () => {
        const wrapper = setupWrapper({ user: { ...user, teacher: false } });

        wrapper.find("form").simulate("submit");

        expect(wrapper.find("Error")).to.have.length(3);

        expect(wrapper.find(`.${style.country} Error`)).to.have.text(
          "Required"
        );
        expect(wrapper.find(`.${style.profession} Error`)).to.have.text(
          "Required"
        );
      });

      it("requires state if selectedCountry is present and stateOptions exist", () => {
        const country = {
          id: "PRT",
          value: "PRT",
          code: "PRT",
          name: "Portugal",
        };

        const wrapper = setupWrapper({
          countryOptions: [{ value: country.value, label: country.name }],
          stateOptions: [{ value: "13", label: "Porto" }],
          selectedCountry: country,
        });

        changeInput(wrapper, "country", country.value);
        wrapper.find("form").simulate("submit");

        expect(wrapper.find(`.${style.country} Error`)).to.have.length(0);
        expect(wrapper.find(`.${style.state} Error`)).to.have.length(1);
        expect(wrapper.find(`.${style.state} Error`)).to.have.text("Required");
      });

      it("does not require state if selectedCountry is present but stateOptions is empty", () => {
        const country = {
          id: "ATA",
          value: "ATA",
          code: "ATA",
          name: "Antarctica",
        };

        const wrapper = setupWrapper({
          countryOptions: [{ value: country.value, label: country.name }],
          selectedCountry: country,
          stateOptions: [],
        });

        changeInput(wrapper, "country", country.value);
        wrapper.find("form").simulate("submit");

        expect(wrapper.find(`.${style.country} Error`)).to.have.length(0);
        expect(wrapper.find(`.${style.state} Error`)).to.have.length(0);
        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.length(0);
      });

      it("requires right postalCode format", () => {
        const selectedCountry = factory.build("country", {
          id: "AUT",
          value: "AUT",
          code: "AUT",
          postalCodeFormat: "/^[0-9A-z]{4}$/",
        });

        const wrapper = setupWrapper({ selectedCountry });

        changeInput(wrapper, "country", selectedCountry.value);

        wrapper.find("form").simulate("submit");

        changeInput(wrapper, "postalCode", "12345");
        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.text(
          "Invalid"
        );

        changeInput(wrapper, "postalCode", "1234");
        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.length(0);

        changeInput(wrapper, "postalCode", "123456");
        wrapper.find("form").simulate("submit");

        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.text(
          "Invalid"
        );
      });

      it("does not require postalCode for non primaryCountries", () => {
        const selectedCountry = factory.build("country", {
          id: "XYZ",
          value: "XYZ",
          code: "XYZ",
          postalCodeFormat: "/^.*$/",
        });

        const wrapper = setupWrapper({ selectedCountry });
        changeInput(wrapper, "country", selectedCountry.value);

        changeInput(wrapper, "postalCode", "");
        wrapper.find("form").simulate("submit");
        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.length(0);

        changeInput(wrapper, "postalCode", "1234");
        expect(wrapper.find(`.${style.postalCode} Error`)).to.have.length(0);
      });

      primaryCountries.forEach((countryCode) => {
        it(`requires postalCode for ${countryCode}`, () => {
          const selectedCountry = factory.build("country", {
            id: countryCode,
            value: countryCode,
            code: countryCode,
            postalCodeFormat: "/^.*$/",
          });

          const wrapper = setupWrapper({ selectedCountry });
          changeInput(wrapper, "country", selectedCountry.value);

          changeInput(wrapper, "postalCode", "");
          wrapper.find("form").simulate("submit");

          changeInput(wrapper, "postalCode", "1234");
          expect(wrapper.find(`.${style.postalCode} Error`)).to.have.length(0);
        });
      });
    });

    it("calls createLocality for submitted forms", () => {
      const selectedCountry = factory.build("country", {
        postalCodeFormat: "/^[0-9A-z]{5}$/",
      });
      const createLocalityMock = jest.fn(() => Promise.resolve());

      const wrapper = setupWrapper({
        user: { ...user, teacher: false },
        createLocality: createLocalityMock,
        selectedCountry,
        countries: [selectedCountry],
      });

      const expectedValues = {
        country: selectedCountry.value,
        state: Object.keys(selectedCountry.states)[0],
        postalCode: "22769",
        city: "Hamburg",
        subjects: "Aufsichtsratsvorsitzende",
      };

      Object.keys(expectedValues).forEach((key) =>
        changeInput(wrapper, key, expectedValues[key])
      );

      wrapper.find("form").simulate("submit");

      expect(wrapper.find(`.${style.state} Error`)).to.have.length(0);
      expect(createLocalityMock.mock.calls[0]).to.deep.equal([expectedValues]);
    });
  });
});
