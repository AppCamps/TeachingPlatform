import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import LogoutComponent from '../components/logout';
import {
  logoutUser,
} from '../actions/authentication';

export function mapDispatchToProps(dispatch) {
  // dirty fix for redirection loop on '/logout' page load
  const redirectToLogin = () => setTimeout(() => dispatch(push('/login')), 0);

  return {
    logoutUser: () => (
      dispatch(logoutUser())
        .then(redirectToLogin)
        .catch(redirectToLogin)
    ),
  };
}

export default connect(() => ({}), mapDispatchToProps)(LogoutComponent);
