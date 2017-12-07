import { delay } from 'redux-saga';
import { takeLatest, takeEvery, select, put, call, all } from 'redux-saga/effects';

import { LOCATION_CHANGE, replace } from 'react-router-redux';

import { trackError } from '../debug';

import { userSelector } from '../selectors/shared/user';
import { authenticationRedirectSelector } from '../selectors/shared/authentication';

import { isAuthenticated } from '../services/auth';
import { notifications } from '../config';
import { t } from '../utils/translations';

import watchNofitications from './notifications';

import {
  AUTHENTICATION_SET_SESSION_EXPIRY,
  AUTHENTICATION_LOGIN_SUCCESS,
  AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
  AUTHENTICATION_INITIAL_LOCALITY_CREATED,
  AUTHENTICATION_LOGOUT,
} from '../constants/authentication';

import { resetApplicationState } from '../actions/application';
import { expireUserSession, loginUserSucceeded, loginUserRedirecting } from '../actions/authentication';
import { requestNotification } from '../actions/notifications';

import { bootIntercom, updateIntercom, shutdownIntercom } from '../services/intercom';
import { setTrackJsUserId } from '../services/trackjs';
import { setAnalyticsUserId } from '../services/analytics';

export function* handleAuthenticationsetSessionExpiry({ payload }) {
  try {
    yield call(delay, payload * 1000);
    yield put(expireUserSession());
  } catch (error) {
    trackError(error);
  }
}

// eslint-disable-next-line no-useless-escape
const validDomainRegExp = new RegExp(`^https?:\/\/([A-z0-9]*\.)*${process.env.DOMAIN}`);

export function* handleAuthentication() {
  try {
    const user = yield select(userSelector);
    if (isAuthenticated(user)) {
      const redirect = yield select(authenticationRedirectSelector);
      if (redirect.match(validDomainRegExp)) {
        yield all([
          put(loginUserRedirecting()),
          put(requestNotification({
            type: notifications.success,
            text: t('Login successful. You will now be redirected...'),
            displayTime: 60000,
          })),
        ]);
        window.location.replace(redirect);
      } else {
        yield all([
          call(bootIntercom, user),
          call(setTrackJsUserId, user.id),
          call(setAnalyticsUserId, user.id),
          put(loginUserSucceeded()),
          put(replace(redirect)),
        ]);
      }
    }
  } catch (error) {
    trackError(error);
  }
}

export function* handleLocationChange() {
  try {
    yield call(updateIntercom);
  } catch (error) {
    trackError(error);
  }
}

export function* handleLogoutUser() {
  try {
    yield call(shutdownIntercom);
    yield put(resetApplicationState());
  } catch (error) {
    trackError(error);
  }
}

export function* watchLocationChange() {
  yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}

export function* watchAuthenticationsetSessionExpiry() {
  yield takeLatest(AUTHENTICATION_SET_SESSION_EXPIRY, handleAuthenticationsetSessionExpiry);
}

export function* watchAuthentication() {
  yield all([
    takeEvery(AUTHENTICATION_LOGIN_SUCCESS, handleAuthentication),
    takeEvery(AUTHENTICATION_PRIVACY_POLICY_ACCEPTED, handleAuthentication),
    takeEvery(AUTHENTICATION_INITIAL_LOCALITY_CREATED, handleAuthentication),
  ]);
}

export function* watchLogoutUser() {
  yield takeEvery(AUTHENTICATION_LOGOUT, handleLogoutUser);
}

export function* rootSaga() {
  yield all([
    call(watchAuthentication),
    call(watchAuthenticationsetSessionExpiry),
    call(watchLogoutUser),
    call(watchLocationChange),
    call(watchNofitications),
  ]);
}
