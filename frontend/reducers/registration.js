import { REGISTRATION_SET_FIRST_NAME } from "../constants/registration";
import { AUTHENTICATION_LOGIN_SUCCESS } from "../constants/authentication";

const initialState = {
  firstName: null,
};

const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTRATION_SET_FIRST_NAME: {
      return { ...state, firstName: action.payload };
    }
    case AUTHENTICATION_LOGIN_SUCCESS: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default registrationReducer;
