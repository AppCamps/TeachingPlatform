import { connect } from 'react-redux';
import Login from '../../components/login';

import {
  loginUser,
  declinePrivacyPolicy,
  acceptPrivacyPolicy,
  restoreUserSession,
  setAuthenticationRedirect,
} from '../../actions/authentication';
import { emailConfirmationRequest } from '../../actions/email-confirmation';
import { userSelector } from '../../selectors/shared/user';
import { authenticationSelector } from '../../selectors/shared/authentication';

export function mapStateToProps(state, ownProps) {
  const { query: { redirect } } = ownProps.location;
  const routeForRedirect = redirect || '/';

  return {
    redirectUrl: routeForRedirect,
    user: userSelector(state),
    authentication: authenticationSelector(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loginUser: formData => (
      dispatch(loginUser(formData))
    ),
    acceptPrivacyPolicy: user => (
      dispatch(acceptPrivacyPolicy(user))
    ),
    declinePrivacyPolicy: () => (
      dispatch(declinePrivacyPolicy())
    ),
    restoreUserSession: () => (
      dispatch(restoreUserSession())
    ),
    setAuthenticationRedirect: redirect => (
      dispatch(setAuthenticationRedirect(redirect))
    ),
    emailConfirmationRequest: email => dispatch(emailConfirmationRequest(email)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
