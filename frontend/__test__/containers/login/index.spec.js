import { expect } from "../../chai_helper";
import TestStore from "../../orm-helper";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/login";

describe("Login Container", () => {
  describe("mapStateToProps", () => {
    const defaultState = {
      authentication: {},
    };
    const ownProps = { location: { pathname: "/tortye", query: {} } };

    describe("redirect", () => {
      it("gets redirect or returns falls back to path", () => {
        const store = new TestStore(defaultState);
        const { state } = store;

        const { redirectUrl } = mapStateToProps(state, {
          location: {
            pathname: "/test",
            query: {
              redirect: "/courses",
            },
          },
        });
        expect(redirectUrl).to.eql("/courses");
      });

      it("returns logged in user", () => {
        const store = new TestStore(defaultState);
        const { factory } = store;

        const loggendInUser = factory.create("user");
        const { user } = mapStateToProps(store.state, ownProps);
        expect(user).to.include(loggendInUser.includeRef);
      });

      it("returns null if no user exists", () => {
        const store = new TestStore(defaultState);

        const { user } = mapStateToProps(store.state, ownProps);
        expect(user).to.eql(null);
      });

      it("returns error", () => {
        const loginError = { code: "test" };
        const store = new TestStore({
          ...defaultState,
          authentication: {
            error: loginError,
          },
        });

        const { authentication } = mapStateToProps(store.state, ownProps);
        expect(authentication.error).to.eql(loginError);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("loginUser", () => {
      const loginUserMock = jest.fn();
      containerRewire.__Rewire__("loginUser", loginUserMock);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const formData = { firstName: "mario" };
      actions.loginUser(formData);
      expect(loginUserMock.mock.calls[0]).to.eql([formData]);
    });

    it("acceptPrivacyPolicy", () => {
      const acceptPrivacyPolicyMock = jest.fn();
      containerRewire.__Rewire__(
        "acceptPrivacyPolicy",
        acceptPrivacyPolicyMock
      );

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const formData = { firstName: "mario" };
      actions.acceptPrivacyPolicy(formData);
      expect(acceptPrivacyPolicyMock.mock.calls[0]).to.eql([formData]);
    });

    it("delinePrivacyPolicy", () => {
      const acceptPrivacyPolicyMock = jest.fn();
      containerRewire.__Rewire__(
        "acceptPrivacyPolicy",
        acceptPrivacyPolicyMock
      );

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.acceptPrivacyPolicy();
      expect(acceptPrivacyPolicyMock.mock.calls).to.have.length(1);
    });

    it("restoreUserSession", () => {
      const restoreUserSessionMock = jest.fn();
      containerRewire.__Rewire__("restoreUserSession", restoreUserSessionMock);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.restoreUserSession();
      expect(restoreUserSessionMock.mock.calls).to.have.length(1);
    });

    it("setAuthenticationRedirect", () => {
      const setAuthenticationRedirectMock = jest.fn();
      containerRewire.__Rewire__(
        "setAuthenticationRedirect",
        setAuthenticationRedirectMock
      );

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.setAuthenticationRedirect("/bruessel");
      expect(setAuthenticationRedirectMock.mock.calls).to.have.length(1);
      expect(setAuthenticationRedirectMock.mock.calls[0]).to.deep.equal([
        "/bruessel",
      ]);
    });
  });
});
