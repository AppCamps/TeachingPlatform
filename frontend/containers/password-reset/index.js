import { connect } from 'react-redux';
import PasswordReset from '../../components/password-reset';

import { passwordResetRequest } from '../../actions/password-reset';

export function mapDispatchToProps(dispatch) {
  return {
    passwordResetRequest: payload => dispatch(passwordResetRequest(payload)),
  };
}

export default connect(() => ({}), mapDispatchToProps)(PasswordReset);
