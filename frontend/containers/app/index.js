import { connect } from "react-redux";

import { userWithAuthenticationSelector } from "../../selectors/shared/user";
import Layout from "../../components/app";

function mapStateToProps(state) {
  return {
    user: userWithAuthenticationSelector(state),
  };
}

export default connect(mapStateToProps)(Layout);
