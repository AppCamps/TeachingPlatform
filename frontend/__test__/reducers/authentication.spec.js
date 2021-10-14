import { expect } from "../chai_helper";

import {
  AUTHENTICATION_LOGIN_REQUEST,
  AUTHENTICATION_LOGIN_SUCCEEDED,
  AUTHENTICATION_LOGIN_FAILURE,
  AUTHENTICATION_LOGIN_REDIRECT,
  AUTHENTICATION_LOGOUT,
  AUTHENTICATION_SET_REDIRECT,
} from "../../constants/authentication";

import authenticationReducer from "../../reducers/authentication";

describe("authenticationReducer", () => {
  it("should return the initial state", () => {
    expect(authenticationReducer(undefined, { type: "none" })).to.deep.equal({
      isAuthenticating: false,
      isAuthenticated: false,
      isRedirecting: false,
      isLoggedOut: false,
      error: null,
      redirect: "/",
    });
  });

  it("should return the state for unmatched action", () => {
    const testState = { state: "test" };
    expect(authenticationReducer(testState, { type: "something" })).to.equal(
      testState
    );
  });

  describe(AUTHENTICATION_LOGIN_REQUEST, () => {
    it("should set isAuthenticating to true", () => {
      expect(
        authenticationReducer(
          {},
          {
            type: AUTHENTICATION_LOGIN_REQUEST,
          }
        )
      ).to.deep.equal({
        isAuthenticating: true,
        isAuthenticated: false,
        isRedirecting: false,
        isLoggedOut: false,
        error: null,
      });
    });
  });

  describe(AUTHENTICATION_LOGIN_SUCCEEDED, () => {
    it("should set set isAuthenticating to false", () => {
      expect(
        authenticationReducer(
          {
            isAuthenticating: true,
            isAuthenticated: false,
            error: "smth",
          },
          {
            type: AUTHENTICATION_LOGIN_SUCCEEDED,
          }
        )
      ).to.deep.equal({
        isAuthenticating: false,
        isAuthenticated: true,
        isRedirecting: false,
        error: null,
      });
    });
  });

  describe(AUTHENTICATION_LOGIN_FAILURE, () => {
    it("should set isAuthenticating to false", () => {
      expect(
        authenticationReducer(
          {
            isAuthenticating: true,
            isAuthenticated: false,
          },
          {
            type: AUTHENTICATION_LOGIN_FAILURE,
            payload: { title: "error" },
          }
        )
      ).to.deep.equal({
        isAuthenticating: false,
        isAuthenticated: false,
        isRedirecting: false,
        error: { title: "error" },
      });
    });
  });

  describe(AUTHENTICATION_LOGIN_REDIRECT, () => {
    it("should set isAuthenticating to false", () => {
      expect(
        authenticationReducer(
          {},
          {
            type: AUTHENTICATION_LOGIN_REDIRECT,
          }
        )
      ).to.deep.equal({
        isAuthenticating: false,
        isAuthenticated: true,
        isRedirecting: true,
        error: null,
      });
    });
  });

  describe(AUTHENTICATION_LOGOUT, () => {
    it("should set isAuthenticating to false", () => {
      expect(
        authenticationReducer(
          {
            isAuthenticating: false,
            isAuthenticated: true,
            isRedirecting: false,
            error: null,
          },
          {
            type: AUTHENTICATION_LOGOUT,
          }
        )
      ).to.deep.equal({
        isAuthenticating: false,
        isAuthenticated: false,
        isRedirecting: false,
        isLoggedOut: true,
        error: null,
        redirect: "/",
      });
    });
  });

  describe(AUTHENTICATION_SET_REDIRECT, () => {
    it("should set redirect", () => {
      expect(
        authenticationReducer(
          {
            redirect: "/",
          },
          {
            type: AUTHENTICATION_SET_REDIRECT,
            payload: "/test",
          }
        )
      ).to.deep.equal({ redirect: "/test" });
    });
  });
});
