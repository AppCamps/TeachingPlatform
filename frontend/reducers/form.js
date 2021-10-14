import { reducer } from "redux-form";

import {
  AUTHENTICATION_LOGIN_FAILURE,
  AUTHENTICATION_LOGIN_SUCCESS,
} from "../constants/authentication";

export default reducer.plugin({
  login: (state, action) => {
    switch (action.type) {
      case AUTHENTICATION_LOGIN_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case AUTHENTICATION_LOGIN_SUCCESS:
        return {
          ...state,
          error: null,
        };
      default: {
        return state || {};
      }
    }
  },
});
