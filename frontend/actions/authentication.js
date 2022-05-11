import { trackError } from "../debug";
import { createLocality } from "./locality";

import {
  AUTHENTICATION_SET_SESSION_EXPIRY,
  AUTHENTICATION_LOGOUT,
  AUTHENTICATION_LOGIN_REQUEST,
  AUTHENTICATION_LOGIN_SUCCESS,
  AUTHENTICATION_LOGIN_SUCCEEDED,
  AUTHENTICATION_LOGIN_FAILURE,
  AUTHENTICATION_LOGIN_REDIRECT,
  AUTHENTICATION_INITIAL_LOCALITY_CREATED,
  AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
  AUTHENTICATION_SET_REDIRECT,
} from "../constants/authentication";
import { apiFetched } from "../actions/api";

import * as api from "../services/api";

export function setSessionExpiry(session) {
  return {
    type: AUTHENTICATION_SET_SESSION_EXPIRY,
    payload: session.expireAfter,
  };
}

export function logoutUser() {
  return (dispatch) =>
    api.deleteSession().catch(() => dispatch({ type: AUTHENTICATION_LOGOUT }));
}

export function loginUserRequest() {
  return {
    type: AUTHENTICATION_LOGIN_REQUEST,
  };
}

export function loginUserRedirecting() {
  return {
    type: AUTHENTICATION_LOGIN_REDIRECT,
  };
}

export function loginUserFailure(payload = null) {
  return {
    type: AUTHENTICATION_LOGIN_FAILURE,
    payload,
  };
}

export function expireUserSession() {
  return (dispatch) =>
    dispatch(logoutUser()).then(() =>
      dispatch(
        loginUserFailure({
          code: "session_expired",
          title: "Your session has expired",
        })
      )
    );
}

export function loginUserSuccess(payload) {
  return (dispatch) => {
    const key = Object.keys(payload.sessions)[0];
    dispatch(setSessionExpiry(payload.sessions[key]));
    dispatch(apiFetched(payload));
    dispatch({ type: AUTHENTICATION_LOGIN_SUCCESS });
  };
}

export function loginUserSucceeded() {
  return { type: AUTHENTICATION_LOGIN_SUCCEEDED };
}

export function loginUser(formData) {
  return (dispatch) => {
    dispatch(loginUserRequest());

    const { email, password } = formData;
    const data = {
      email: email.toLowerCase(),
      password,
    };
    return api
      .createSession(data)
      .then((payload) => {
        dispatch(loginUserSuccess(payload));
        return Promise.resolve();
      })
      .catch((apiErrors) => {
        try {
          const error = apiErrors[0];
          if (!error) throw apiErrors;

          if (error.code || error.title) {
            dispatch(loginUserFailure({ ...error, email }));
          }
        } catch (error) {
          trackError(error);
          dispatch(loginUserFailure());
        }
      });
  };
}

export function restoreUserSession() {
  return (dispatch) =>
    api
      .getSession()
      .then((payload) => {
        dispatch(loginUserSuccess(payload));
        return Promise.resolve();
      })
      .catch((error) => {
        if (error && error.stack) {
          trackError(error);
        }
      });
}

export function loginPrivacyPolicyAccepted() {
  return {
    type: AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
  };
}

export function declinePrivacyPolicy() {
  return (dispatch) => {
    return dispatch(logoutUser());
  };
}

export function acceptPrivacyPolicy(user) {
  const userWithAcceptedPrivacyPolicy = {
    ...user,
    privacyPolicyAccepted: true,
  };

  return (dispatch) =>
    api.updateUser(userWithAcceptedPrivacyPolicy).then((payload) => {
      if (payload.errors) {
        return Promise.reject(payload.errors[0]);
      }

      dispatch(apiFetched(payload));
      dispatch(loginPrivacyPolicyAccepted());

      return Promise.resolve();
    });
}

export function initialLocalityCreated() {
  return {
    type: AUTHENTICATION_INITIAL_LOCALITY_CREATED,
  };
}

export function setAuthenticationRedirect(route) {
  return {
    type: AUTHENTICATION_SET_REDIRECT,
    payload: route,
  };
}

export function createInitialLocality(locality) {
  return (dispatch) =>
    dispatch(createLocality(locality)).then(() =>
      dispatch(initialLocalityCreated())
    );
}
