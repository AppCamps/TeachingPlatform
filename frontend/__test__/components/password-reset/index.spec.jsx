import React from "react";
import PropTypes from "prop-types";
import { reducer as formReducer } from "redux-form";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import { mount } from "enzyme";

import { expect } from "../../chai_helper";

import PasswordResetRequest from "../../../components/password-reset";

import Error from "../../../components/atoms/a-error";

describe("<PasswordResetRequest />", () => {
  const store = createStore(combineReducers({ form: formReducer }));

  let passwordResetRequestMock;
  beforeEach(() => {
    passwordResetRequestMock = jest.fn(() => Promise.resolve({}));
  });

  const setupWrapper = (component) =>
    mount(<Provider store={store}>{component}</Provider>, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: { t: PropTypes.func },
    });

  const findErrorForName = (name) => (n) => n.prop("for") === name;
  const findError = (wrapper, name) =>
    wrapper.find(Error).findWhere(findErrorForName(name));
  const changeInput = (wrapper, name, value) => {
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate("change", { target: { value } });
  };

  it("renders form correctly", () => {
    const registrationTree = setupWrapper(<PasswordResetRequest />);
    global.expect(registrationTree).toMatchSnapshot();
  });

  describe("validation", () => {
    it("requires email to be present", () => {
      const wrapper = setupWrapper(<PasswordResetRequest />);

      wrapper.find("form").simulate("submit");

      expect(findError(wrapper, "email")).to.have.text("Required");

      expect(passwordResetRequestMock.mock.calls).to.have.length(0);
    });

    it("requires email to be an email", () => {
      const wrapper = setupWrapper(
        <PasswordResetRequest passwordResetRequest={passwordResetRequestMock} />
      );

      changeInput(wrapper, "email", "testasd");
      wrapper.find("form").simulate("submit");

      let error = findError(wrapper, "email");

      expect(error.length).to.equal(1);
      expect(error).to.have.text("Not an email");

      changeInput(wrapper, "email", "some@email.de");
      wrapper.find("form").simulate("submit");
      error = findError(wrapper, "email");
      expect(error.length).to.equal(0);
    });
  });

  it("disables submit button while submitting", () => {
    const passwordResetRequest = () => {
      const promise = new Promise(() => Promise.resolve());
      setTimeout(() => promise.resolve({}), 10);
      return promise;
    };
    const wrapper = setupWrapper(
      <PasswordResetRequest passwordResetRequest={passwordResetRequest} />
    );

    changeInput(wrapper, "email", "test@test.de");

    wrapper.find("form").simulate("submit");
    expect(wrapper.find("button").prop("disabled")).to.equal(true);
  });
});
