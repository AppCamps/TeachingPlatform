import { push } from "react-router-redux";
import { connect } from "react-redux";

import LogoutComponent from "../components/logout";
import { logoutUser } from "../actions/authentication";

export function mapDispatchToProps(dispatch) {
  const redirectToLogin = () => dispatch(push("/login"));

  return {
    logoutUser: () =>
      dispatch(logoutUser()).then(redirectToLogin).catch(redirectToLogin),
  };
}

export default connect(() => ({}), mapDispatchToProps)(LogoutComponent);
