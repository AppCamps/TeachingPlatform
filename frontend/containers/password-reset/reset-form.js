import { connect } from 'react-redux';
import get from 'lodash.get';
import PasswordResetForm from '../../components/password-reset/reset-form';

import { passwordReset } from '../../actions/password-reset';

export function mapStateToProps(state, ownProps) {
  return {
    passwordResetToken: get(ownProps, 'params.passwordResetToken'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    passwordReset: (payload, token) => dispatch(passwordReset(payload, token)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm);
