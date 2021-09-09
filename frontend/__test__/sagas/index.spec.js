import { delay } from 'redux-saga';
import { put, call, takeEvery } from 'redux-saga/effects';

import { testSaga } from 'redux-saga-test-plan';
import { LOCATION_CHANGE, replace } from 'react-router-redux';

import { expect } from '../chai_helper';
import factory from '../__factories__';

import { notifications } from '../../config';

import {
  watchAuthenticationsetSessionExpiry,
  handleAuthenticationsetSessionExpiry,
  watchAuthentication,
  handleAuthentication,
  watchLogoutUser,
  handleLogoutUser,
  watchLocationChange,
  handleLocationChange,
  rootSaga,
  __RewireAPI__ as SagaRewireApi,
} from '../../sagas';

import watchNofitications from '../../sagas/notifications';

import { userSelector } from '../../selectors/shared/user';
import { authenticationRedirectSelector } from '../../selectors/shared/authentication';

import { bootIntercom, updateIntercom, shutdownIntercom } from '../../services/intercom';
import { setTrackJsUserId } from '../../services/trackjs';
import { setAnalyticsUserId } from '../../services/analytics';

import {
  AUTHENTICATION_SET_SESSION_EXPIRY,
  AUTHENTICATION_INITIAL_LOCALITY_CREATED,
  AUTHENTICATION_LOGIN_SUCCESS,
  AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
  AUTHENTICATION_LOGOUT,
} from '../../constants/authentication';

import { resetApplicationState } from '../../actions/application';
import { requestNotification } from '../../actions/notifications';
import { expireUserSession, loginUserSucceeded, loginUserRedirecting } from '../../actions/authentication';

describe('sagas', () => {
  describe('expireUserSession', () => {
    it('*watchAuthenticationsetSessionExpiry saga test', () => {
      testSaga(watchAuthenticationsetSessionExpiry)
        .next()
        .takeLatestEffect(AUTHENTICATION_SET_SESSION_EXPIRY, handleAuthenticationsetSessionExpiry)
        .finish()
        .isDone();
    });

    it('*handleAuthenticationsetSessionExpiry saga test', () => {
      // not using redux-saga-test-plan because expireUserSession returns a thunk => would not match
      const generator = handleAuthenticationsetSessionExpiry({ payload: 10 });

      let next = generator.next();
      expect(next.value).to.deep.equal(call(delay, 10000));

      next = generator.next();
      expect(next.value.PUT.action.toString())
        .to.deep.equal(put(expireUserSession()).PUT.action.toString());
    });
  });

  describe('authenticationFinished', () => {
    it('*watchAuthentication saga test', () => {
      testSaga(watchAuthentication)
        .next()
        .all([
          takeEvery(
            AUTHENTICATION_LOGIN_SUCCESS,
            handleAuthentication,
          ),
          takeEvery(
            AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
            handleAuthentication,
          ),
          takeEvery(
            AUTHENTICATION_INITIAL_LOCALITY_CREATED,
            handleAuthentication,
          ),
        ])
        .finish()
        .isDone();
    });

    describe('*handleAuthentication saga test', () => {
      const authenticatedUserEffects = (user, redirect) => ([
        call(bootIntercom, user),
        call(setTrackJsUserId, user.id),
        call(setAnalyticsUserId, user.id),
        put(loginUserSucceeded()),
        put(replace(redirect)),
      ]);

      afterEach(() => SagaRewireApi.__ResetDependency__('isAuthenticated'));

      it('does nothing if user is not authenticated', () => {
        SagaRewireApi.__Rewire__('isAuthenticated', () => false);
        const testUser = {};
        testSaga(handleAuthentication)
          .next()
          .select(userSelector)
          .next(testUser)
          .finish()
          .isDone();
      });

      describe('teach login', () => {
        it('*initializes services and redirects', () => {
          const testUser = factory.build('user', { token: '123', privacyPolicyAccepted: true });
          testSaga(handleAuthentication)
            .next()
            .select(userSelector)
            .next(testUser)
            .select(authenticationRedirectSelector)
            .next('/courses')
            .all(authenticatedUserEffects(testUser, '/courses'))
            .finish()
            .isDone();
        });
      });

      describe('external login', () => {
        beforeEach(() => {
          Object.defineProperty(window, 'location', { value: jest.fn() });
        });

        it('*redirects to external service', () => {
          const replaceMock = jest.fn();
          window.location.replace = replaceMock;

          const redirect = `http://${process.env.DOMAIN}/test`;
          const testUser = factory.build('user', { token: '123', privacyPolicyAccepted: true });

          testSaga(handleAuthentication)
            .next()
            .select(userSelector)
            .next(testUser)
            .select(authenticationRedirectSelector)
            .next(redirect)
            .all([
              put(loginUserRedirecting()),
              put(requestNotification({
                type: notifications.success,
                text: 'Login successful. You will now be redirected...',
                displayTime: 60000,
              })),
            ])
            .next()
            .isDone();

          expect(replaceMock.mock.calls[0]).to.eql([redirect]);
        });
      });
    });
  });

  describe('logoutUser', () => {
    it('*watchLogoutUser saga test', () => {
      testSaga(watchLogoutUser)
        .next()
        .takeEveryEffect(AUTHENTICATION_LOGOUT, handleLogoutUser)
        .finish()
        .isDone();
    });

    it('*handleLogoutUser saga test', () => {
      testSaga(handleLogoutUser)
        .next()
        .call(shutdownIntercom)
        .next()
        .put(resetApplicationState())
        .next()
        .isDone();
    });
  });

  describe('locationChange', () => {
    it('*watchLocationChange saga test', () => {
      testSaga(watchLocationChange)
        .next()
        .takeEveryEffect(LOCATION_CHANGE, handleLocationChange)
        .finish()
        .isDone();
    });

    it('*handleLocationChange saga test', () => {
      testSaga(handleLocationChange)
        .next()
        .call(updateIntercom)
        .next()
        .isDone();
    });
  });

  describe('rootSaga', () => {
    it('*starts all saga watchers', () => {
      testSaga(rootSaga)
        .next()
        .all([
          call(watchAuthentication),
          call(watchAuthenticationsetSessionExpiry),
          call(watchLogoutUser),
          call(watchLocationChange),
          call(watchNofitications),
        ])
        .finish()
        .isDone();
    });
  });
});
