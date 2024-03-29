import { push } from "react-router-redux";

import { createUser as createUserApiRequest } from "../services/api";

import { REGISTRATION_SET_FIRST_NAME } from "../constants/registration";

export function registrationSetUserFirstName(firstName) {
  return {
    type: REGISTRATION_SET_FIRST_NAME,
    payload: firstName,
  };
}

export function createUser(user) {
  return (dispatch) =>
    createUserApiRequest(user).then((payload) => {
      dispatch(registrationSetUserFirstName(user.firstName));
      dispatch(push("/registration/success"));
      return payload;
    });
}
