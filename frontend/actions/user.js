import { updateUser as updateUserApiRequest } from "../services/api";
import { apiFetched } from "./api";

export function updateUser(user) {
  return (dispatch) =>
    updateUserApiRequest(user).then((payload) => {
      dispatch(apiFetched(payload));
      return payload;
    });
}
