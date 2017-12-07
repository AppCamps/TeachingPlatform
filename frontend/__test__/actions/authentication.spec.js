/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';
import factory from '../__factories__';
import storage from '../../utils/storage';

import * as createSessionFixtures from '../fixtures/api/createSession';
/* eslint-disable import/no-duplicates, no-duplicate-imports */

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/* eslint-disable import/first */
import { __RewireAPI__ as APIRewireApi } from '../../services/api';

APIRewireApi.__Rewire__('store', mockStore);

import {
  AUTHENTICATION_LOGIN_REQUEST,
  AUTHENTICATION_LOGIN_SUCCESS,
  AUTHENTICATION_LOGIN_FAILURE,
  AUTHENTICATION_LOGOUT,
  AUTHENTICATION_SET_SESSION_EXPIRY,
  AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
} from '../../constants/authentication';

import {
  loginUserRequest,
  loginUserSuccess,
  acceptPrivacyPolicy,
  declinePrivacyPolicy,
  loginUserFailure,
  loginUser,
  restoreUserSession,
  expireUserSession,
  setSessionExpiry,
  __RewireAPI__ as ActionsRewireAPI,
} from '../../actions/authentication';

import { apiFetched } from '../../actions/api';
/* eslint-enable import/first import/no-duplicates, no-duplicate-imports */

function normalizeUserAndSessionResponse(user, session) {
  return {
    users: {
      [user.id]: user,
    },
    sessions: {
      [session.id]: session,
    },
  };
}

describe('authentication actions', () => {
  afterEach(() => storage.clear());

  describe('#loginUserRequest', () => {
    it('should create an login user request action', () => {
      const expectedAction = {
        type: AUTHENTICATION_LOGIN_REQUEST,
      };
      expect(loginUserRequest()).to.deep.equal(expectedAction);
    });
  });

  describe('#loginUserSuccess', () => {
    it('should create an login user success action', () => {
      const session = { id: 'session', expireAfter: 1000 };
      const user = { id: '123', email: 'horst' };
      const reponseData = normalizeUserAndSessionResponse(user, session);

      const expectedActions = [
        setSessionExpiry(session),
        apiFetched(reponseData),
        { type: AUTHENTICATION_LOGIN_SUCCESS },
      ];
      const store = mockStore({ user: {} });

      store.dispatch(loginUserSuccess(reponseData));

      const calledActions = store.getActions();
      expect(calledActions).to.deep.equal(expectedActions);
    });
  });

  describe('#loginUserFailure', () => {
    it('should create an login user failure action', () => {
      const expectedAction = {
        type: AUTHENTICATION_LOGIN_FAILURE,
        payload: { code: 'asd', title: 'bla' },
      };
      expect(loginUserFailure({ code: 'asd', title: 'bla' })).to.deep.equal(expectedAction);
    });
  });

  describe('#loginUser', () => {
    afterEach(() => {
      ActionsRewireAPI.__ResetDependency__('api');

      delete window.trackJs;
    });

    describe('sucess', () => {
      it('should make an api request and dispatch', () => {
        const session = { id: 'session', expireAfter: 1000 };
        const user = { id: '123', email: 'horst' };
        const reponseData = normalizeUserAndSessionResponse(user, session);

        const expectedActions = [
          loginUserRequest(),
          setSessionExpiry(session),
          apiFetched(reponseData),
          {
            type: AUTHENTICATION_LOGIN_SUCCESS,
          },
        ];

        ActionsRewireAPI.__Rewire__('api', {
          createSession: () => Promise.resolve(reponseData),
        });

        const store = mockStore({ user: {} });
        return store.dispatch(loginUser({ email: 'hans@test.de', password: '1234' })).then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);
        });
      });

      it('should lowercase email', () => {
        let calledEmail;
        ActionsRewireAPI.__Rewire__('api', {
          createSession: (userData) => {
            calledEmail = userData.email;
            return Promise.reject({ errors: [{ title: 'error', code: 'error' }] });
          },
        });

        const store = mockStore({ user: {} });
        return store.dispatch(loginUser({ email: 'Horst@test.de', password: '1234' })).then(() => {
          expect(calledEmail).to.deep.eql('horst@test.de');
        });
      });
    });

    describe('failure', () => {
      describe('username / password wrong', () => {
        it('should dispatch error actions and not track error', () => {
          let errorTracked = false;
          window.trackJs = {
            track: () => {
              errorTracked = true;
            },
          };

          ActionsRewireAPI.__Rewire__('api', {
            createSession: () =>
              Promise.reject(JSON.parse(createSessionFixtures.errorResponse).errors),
          });

          const expectedActions = [
            {
              type: AUTHENTICATION_LOGIN_REQUEST,
            },
            {
              type: AUTHENTICATION_LOGIN_FAILURE,
              payload: {
                code: 'invalid_email_or_password',
                title: 'Invalid email or password',
                email: 'hans@test.de',
              },
            },
          ];

          const store = mockStore({ user: {} });
          return store.dispatch(loginUser({ email: 'hans@test.de', password: '1234' })).then(() => {
            expect(store.getActions()).to.deep.eql(expectedActions);
            expect(errorTracked).to.eql(false);
          });
        });
      });

      describe('some other error', () => {
        afterEach(() => {
          delete window.trackJs;
        });

        it('should dispatch error actions and track error', () => {
          const thrownError = new Error('login test error case');
          const trackErrorMock = jest.fn();

          ActionsRewireAPI.__Rewire__('api', {
            createSession: () => Promise.reject(thrownError),
          });
          ActionsRewireAPI.__Rewire__('trackError', trackErrorMock);

          const expectedActions = [
            {
              type: AUTHENTICATION_LOGIN_REQUEST,
            },
            {
              type: AUTHENTICATION_LOGIN_FAILURE,
              payload: null,
            },
          ];

          const store = mockStore({ user: {} });
          return store.dispatch(loginUser({ email: 'hans@test.de', password: '1234' })).then(() => {
            expect(store.getActions()).to.deep.eql(expectedActions);
            expect(trackErrorMock.mock.calls[0][0]).to.eql(thrownError);
          });
        });
      });
    });
  });

  describe('#restoreUserSession', () => {
    afterEach(() => {
      ActionsRewireAPI.__ResetDependency__('api');

      delete window.trackJs;
    });

    describe('sucess', () => {
      it('should make an api request and dispatch', () => {
        const session = { id: 'session', expireAfter: 123 };
        const user = { id: '123', email: 'horst' };
        const responseData = normalizeUserAndSessionResponse(user, session);

        storage.set('token', session.token);

        ActionsRewireAPI.__Rewire__('api', {
          getSession: () => Promise.resolve(responseData),
        });

        const expectedActions = [
          setSessionExpiry(session),
          apiFetched(responseData),
          { type: AUTHENTICATION_LOGIN_SUCCESS },
        ];

        const store = mockStore({ user: {} });
        return store.dispatch(restoreUserSession('/somwhere/else')).then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);
        });
      });
    });

    describe('failure', () => {
      afterEach(() => {
        delete window.trackJs;
      });

      it('should dispatch error actions and not track error', () => {
        let errorTracked = false;
        window.trackJs = {
          track: () => {
            errorTracked = true;
          },
        };

        ActionsRewireAPI.__Rewire__('api', {
          getSession: () => Promise.reject(JSON.parse(createSessionFixtures.errorResponse).errors),
          deleteSession: () => Promise.reject({}),
        });

        const expectedActions = [];

        const store = mockStore({ user: {} });
        storage.set('token', '123');
        return store.dispatch(restoreUserSession()).then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);
          expect(errorTracked).to.eql(false);
        });
      });
    });
  });

  describe('#acceptPrivacyPolicy', () => {
    afterEach(() => {
      ActionsRewireAPI.__ResetDependency__('api');
      delete window.trackJs;
    });

    describe('sucess', () => {
      it('should make an api request and dispatch', () => {
        const gaArgs = [];
        ActionsRewireAPI.__Rewire__('trackAnalyticsEvent', (...args) => {
          gaArgs.push(args);
          return true;
        });

        const user = factory.build('user', { privacyPolicyAccepted: false });
        const acceptedUser = { ...user, privacyPolicyAccepted: true };

        const normalizedResponse = {
          users: {
            [`${user.id}`]: acceptedUser,
          },
        };
        const updateUserMock = jest.fn(() => Promise.resolve(normalizedResponse));

        ActionsRewireAPI.__Rewire__('api', {
          updateUser: updateUserMock,
        });

        const expectedActions = [
          apiFetched(normalizedResponse),
          {
            type: AUTHENTICATION_PRIVACY_POLICY_ACCEPTED,
          },
        ];

        const store = mockStore({});
        return store.dispatch(acceptPrivacyPolicy(user, 'redirect_url')).then(() => {
          expect(updateUserMock.mock.calls[0]).to.eql([acceptedUser]);
          expect(gaArgs[0]).to.deep.eql(['PrivacyPolicy', 'accept']);

          const calledActions = store
            .getActions()
            .filter(action => action.type !== '@@router/CALL_HISTORY_METHOD');
          expect(calledActions).to.deep.eql(expectedActions);
        });
      });
    });
  });

  describe('#declinePrivacyPolicy', () => {
    afterEach(() => {
      ActionsRewireAPI.__ResetDependency__('trackAnalyticsEvent');
      ActionsRewireAPI.__ResetDependency__('api');
      delete window.trackJs;
    });

    describe('success', () => {
      it('should make an api request and dispatch', (done) => {
        const gaArgs = [];
        ActionsRewireAPI.__Rewire__('trackAnalyticsEvent', (...args) => {
          gaArgs.push(args);
          return true;
        });

        ActionsRewireAPI.__Rewire__('api', {
          deleteSession: () => Promise.reject({}),
        });

        const user = factory.build('user', { privacyPolicyAccepted: false });

        const expectedActions = [
          {
            type: AUTHENTICATION_LOGOUT,
          },
        ];

        const store = mockStore({});

        store
          .dispatch(declinePrivacyPolicy(user, 'token_123'))
          .then(() => {
            expect(gaArgs[0]).to.deep.eql(['PrivacyPolicy', 'decline']);

            const calledActions = store.getActions();
            expect(calledActions).to.deep.eql(expectedActions);

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('#setSessionExpiry', () => {
    it('should create setSessionExpiry action', () => {
      expect(setSessionExpiry({ expireAfter: 10 })).to.deep.equal({
        type: AUTHENTICATION_SET_SESSION_EXPIRY,
        payload: 10,
      });
    });
  });

  describe('#expireUserSession', () => {
    afterEach(() => {
      ActionsRewireAPI.__ResetDependency__('api');
      storage.remove('user');
    });

    it('should dispatch logoutUser and loginUserFailure with session expired error', (done) => {
      const user = { id: '123', email: 'horst', token: 'token_123' };

      storage.set('user', JSON.stringify(Object.assign(user)));

      ActionsRewireAPI.__Rewire__('api', {
        deleteSession: () => Promise.reject({}),
      });

      const expectedActions = [
        {
          type: AUTHENTICATION_LOGOUT,
        },
        {
          type: AUTHENTICATION_LOGIN_FAILURE,
          payload: {
            code: 'session_expired',
            title: 'Your session has expired',
          },
        },
      ];

      const store = mockStore({ user });

      store
        .dispatch(expireUserSession())
        .then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);

          done();
        })
        .catch(done.fail);
    });
  });
});
