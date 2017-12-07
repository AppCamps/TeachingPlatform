import {
  AUTHENTICATION_LOGIN_REQUEST,
  AUTHENTICATION_LOGIN_SUCCEEDED,
  AUTHENTICATION_LOGIN_FAILURE,
  AUTHENTICATION_LOGIN_REDIRECT,
  AUTHENTICATION_LOGOUT,
  AUTHENTICATION_SET_REDIRECT,
} from '../constants/authentication';

const initialState = {
  isAuthenticating: false,
  isAuthenticated: false,
  isRedirecting: false,
  isLoggedOut: false,
  error: null,
  redirect: '/',
};

const authenticationReducer = (authenticationState, action) => {
  if (!authenticationState) {
    return initialState;
  }

  switch (action.type) {
    case AUTHENTICATION_LOGIN_REQUEST: {
      return {
        ...authenticationState,
        isAuthenticating: true,
        isAuthenticated: false,
        isRedirecting: false,
        isLoggedOut: false,
        error: null,
      };
    }
    case AUTHENTICATION_LOGIN_SUCCEEDED: {
      return {
        ...authenticationState,
        isAuthenticating: false,
        isAuthenticated: true,
        isRedirecting: false,
        error: null,
      };
    }
    case AUTHENTICATION_LOGIN_FAILURE: {
      return {
        ...authenticationState,
        isAuthenticating: false,
        isAuthenticated: false,
        isRedirecting: false,
        error: action.payload,
      };
    }
    case AUTHENTICATION_LOGIN_REDIRECT: {
      return {
        ...authenticationState,
        isAuthenticating: false,
        isAuthenticated: true,
        isRedirecting: true,
        error: null,
      };
    }
    case AUTHENTICATION_LOGOUT: {
      return {
        ...initialState,
        isLoggedOut: true,
      };
    }
    case AUTHENTICATION_SET_REDIRECT: {
      return {
        ...authenticationState,
        redirect: action.payload,
      };
    }
    default: {
      return authenticationState;
    }
  }
};

export default authenticationReducer;
