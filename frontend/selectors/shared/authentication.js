export const authenticationSelector = (state) => state.authentication;
export const authenticationErrorSelector = (state) =>
  state.authentication.error;
export const authenticationRedirectSelector = (state) =>
  state.authentication.redirect;
