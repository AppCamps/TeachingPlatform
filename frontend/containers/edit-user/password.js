import { connect } from "react-redux";

import { updateUser } from "../../actions/user";
import EditUserPasswordComponent from "../../components/edit-user/password";
import { userSelector } from "../../selectors/shared/user";

export function mapStateToProps(state) {
  const user = userSelector(state);

  return {
    user,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserPasswordComponent);
