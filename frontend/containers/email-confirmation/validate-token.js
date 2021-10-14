import { connect } from "react-redux";
import get from "lodash.get";
import EmailConfirmation from "../../components/email-confirmation/validate-token";

import { emailConfirmation } from "../../actions/email-confirmation";

export function mapStateToProps(state, ownProps) {
  return {
    emailConfirmationToken: get(ownProps, "params.emailConfirmationToken"),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    emailConfirmation: (token) => dispatch(emailConfirmation(token)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfirmation);
