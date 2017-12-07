import { UserAuthWrapper as userAuthWrapper } from 'redux-auth-wrapper';
import { userWithAuthenticationSelector } from '../selectors/shared/user';

export function isAuthenticated(user) {
  return !!(user && user.privacyPolicyAccepted && user.locality);
}

const userIsLoggedIn = userAuthWrapper({
  authSelector: userWithAuthenticationSelector,
  predicate: isAuthenticated,
  wrapperDisplayName: 'userIsLoggedIn',
  failureRedirectPath: '/login',
});

const userIsLoggedOut = userAuthWrapper({
  authSelector: userWithAuthenticationSelector,
  predicate: user =>
    // user object is empty or privacy policy is not accepted (handled by login component)
    !user || Object.keys(user).length === 0 || !isAuthenticated(user),
  wrapperDisplayName: 'userIsLoggedOut',
  failureRedirectPath: '/',
  allowRedirectBack: false,
});

export const requireLoggedInUser = userIsLoggedIn(props => props.children);
export const requireLoggedOutUser = userIsLoggedOut(props => props.children);
