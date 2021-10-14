import React from "react";

import { shallow } from "enzyme";
import { createStore, combineReducers } from "redux";
import { reducer } from "redux-form";

import { expect } from "../../chai_helper";
import factory from "../../__factories__";

import Login from "../../../components/login";
import LoginForm from "../../../components/login/login-form";
import AcceptPrivacyPolicy from "../../../components/login/accept-privacy-policy";

import LocalityContainer from "../../../containers/login/locality";

describe("<Login />", () => {
  const user = factory.build("user", {
    privacyPolicyAccepted: false,
  });
  const redirectUrl = "/courses";
  const loginUser = () => true;
  const declinePrivacyPolicy = () => true;
  const acceptPrivacyPolicy = () => true;
  const setAuthenticationRedirect = () => true;
  const authentication = {
    isAuthenticated: false,
    isRedirecting: false,
    error: { title: "error" },
  };
  const emailConfirmationRequest = () => true;
  const restoreUserSession = () => {};

  const defaultProps = {
    user,
    redirectUrl,
    loginUser,
    declinePrivacyPolicy,
    acceptPrivacyPolicy,
    setAuthenticationRedirect,
    emailConfirmationRequest,
    authentication,
    restoreUserSession,
  };

  it("renders LoginForm without user", () => {
    const store = createStore(
      combineReducers({
        form: reducer,
      })
    );

    const wrapper = shallow(<Login {...defaultProps} user={null} />, {
      context: { t: (str) => str, store },
    });

    expect(wrapper).to.contain(
      <LoginForm
        loginUser={loginUser}
        authenticationError={authentication.error}
        emailConfirmationRequest={emailConfirmationRequest}
      />
    );
  });

  it("renders nothing when isRedirecting is true", () => {
    const wrapper = shallow(
      <Login
        {...defaultProps}
        authentication={{ isRedirecting: true }}
        user={null}
      />,
      {
        context: { t: (str) => str },
      }
    );

    expect(wrapper).to.be.blank();
  });

  it("renders acceptPrivacyPolicy for authenticated user with privacyPolicyAccepted: false", () => {
    const userWithoutAcceptedPrivacyPolicy = factory.build("user", {
      isAuthenticated: true,
      privacyPolicyAccepted: false,
    });
    const wrapper = shallow(
      <Login {...defaultProps} user={userWithoutAcceptedPrivacyPolicy} />
    );

    expect(wrapper).to.contain(
      <AcceptPrivacyPolicy
        {...{
          acceptPrivacyPolicy,
          declinePrivacyPolicy,
          user: userWithoutAcceptedPrivacyPolicy,
        }}
      />
    );
  });

  it("renders LocalityContainer if user.locality === false", () => {
    const userWithoutLocality = factory.build("user", {
      isAuthenticated: true,
      privacyPolicyAccepted: true,
      locality: null,
    });

    const wrapper = shallow(
      <Login {...defaultProps} user={userWithoutLocality} />
    );
    expect(wrapper.find(LocalityContainer).length).to.eql(1);
  });

  describe("componentDidMount", () => {
    it("sets authentication redirect", () => {
      const setAuthenticationRedirectMock = jest.fn();
      shallow(
        <Login
          {...defaultProps}
          setAuthenticationRedirect={setAuthenticationRedirectMock}
          redirectUrl="/test"
        />
      );

      expect(setAuthenticationRedirectMock.mock.calls).to.have.length(1);
      expect(setAuthenticationRedirectMock.mock.calls[0]).to.eql(["/test"]);
    });

    describe.only("restoreUserSession", () => {
      it("tries to restore user session on mount", () => {
        const restoreUserSessionMock = jest.fn();
        shallow(
          <Login
            {...defaultProps}
            restoreUserSession={restoreUserSessionMock}
            isAuthenticated={false}
            isLoggedOut={false}
          />
        );

        expect(restoreUserSessionMock.mock.calls).to.have.length(1);
      });

      it("tries not to restore user session if user is authenticated but not logged in", () => {
        const restoreUserSessionMock = jest.fn();
        shallow(
          <Login
            {...defaultProps}
            restoreUserSession={restoreUserSessionMock}
            authentication={{
              isAuthenticated: true,
              isLoggedOut: false,
            }}
          />
        );

        expect(restoreUserSessionMock.mock.calls).to.have.length(0);
      });

      it("tries not to restore user session if user is not authenticated but logged in", () => {
        const restoreUserSessionMock = jest.fn();
        shallow(
          <Login
            {...defaultProps}
            restoreUserSession={restoreUserSessionMock}
            authentication={{
              isAuthenticated: false,
              isLoggedOut: true,
            }}
          />
        );

        expect(restoreUserSessionMock.mock.calls).to.have.length(0);
      });

      it("tries not to restore user session if user is authenticated and logged out", () => {
        const restoreUserSessionMock = jest.fn();
        shallow(
          <Login
            {...defaultProps}
            restoreUserSession={restoreUserSessionMock}
            authentication={{
              isAuthenticated: true,
              isLoggedOut: true,
            }}
            isLoggedOut={false}
          />
        );

        expect(restoreUserSessionMock.mock.calls).to.have.length(0);
      });
    });
  });
});
