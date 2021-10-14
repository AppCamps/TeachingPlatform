import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoginForm from './login-form';
import AcceptPrivacyPolicy from './accept-privacy-policy';
import LocalityForm from '../../containers/login/locality';

class Login extends Component {
  componentDidMount() {
    const {
      restoreUserSession,
      setAuthenticationRedirect,
      redirectUrl,
      authentication: { isAuthenticated, isLoggedOut },
    } = this.props;
    setAuthenticationRedirect(redirectUrl);
    if (!isAuthenticated && !isLoggedOut) {
      restoreUserSession();
    }
  }

  render() {
    const {
      user, loginUser, emailConfirmationRequest,
      authentication: { error, isRedirecting },
      acceptPrivacyPolicy, declinePrivacyPolicy,
    } = this.props;

    if (isRedirecting) { return null; }

    if (user) {
      if (!user.privacyPolicyAccepted) {
        return (
          <AcceptPrivacyPolicy
            {...{ acceptPrivacyPolicy, declinePrivacyPolicy, user }}
          />
        );
      } else if (user && !user.locality) {
        return (
          <LocalityForm />
        );
      }
    }

    return (
      <LoginForm
        loginUser={loginUser}
        emailConfirmationRequest={emailConfirmationRequest}
        authenticationError={error}
      />
    );
  }
}

Login.propTypes = {
  redirectUrl: PropTypes.string.isRequired,
  loginUser: PropTypes.func.isRequired,
  acceptPrivacyPolicy: PropTypes.func.isRequired,
  declinePrivacyPolicy: PropTypes.func.isRequired,
  restoreUserSession: PropTypes.func.isRequired,
  setAuthenticationRedirect: PropTypes.func.isRequired,
  emailConfirmationRequest: PropTypes.func.isRequired,
  user: PropTypes.shape({ id: PropTypes.string }),
  authentication: PropTypes.shape({
    error: PropTypes.shape({
      code: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};

Login.defaultProps = {
  redirectUrl: null,
  user: null,
  error: null,
  location: {},
};

export default Login;
