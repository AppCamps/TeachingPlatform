import { connect } from "react-redux";
import { push } from "react-router-redux";

import RegistrationSuccessComponent from "../../components/registration/success";
import { registrationFirstNameSelector } from "../../selectors/registration";

export function mapStateToProps(state) {
  return {
    firstName: registrationFirstNameSelector(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    redirectToRegistrationPage: () => dispatch(push("/registration")),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationSuccessComponent);
