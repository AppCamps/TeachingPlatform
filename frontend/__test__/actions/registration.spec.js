/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';

import { user, normalizedSuccessResponse } from '../fixtures/api/createUser';

import {
  createUser,
  registrationSetUserFirstName,
  __RewireAPI__ as RewireAPI,
} from '../../actions/registration';

import { REGISTRATION_SET_FIRST_NAME } from '../../constants/registration';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Registration actions', () => {
  describe('createUser', () => {
    it("should send create request to api and dispatch apiFetched and push('/registration/success')", () => {
      const createUserApiRequestMock = jest.fn(() => Promise.resolve(normalizedSuccessResponse));
      RewireAPI.__Rewire__(
        'createUserApiRequest',
        createUserApiRequestMock,
      );

      const expectedActions = [
        {
          type: REGISTRATION_SET_FIRST_NAME,
          payload: user.firstName,
        },
      ];

      const store = mockStore({});
      return store
        .dispatch(createUser(user))
        .then(() => {
          const calledActions = store.getActions().filter(action => (
            action.type !== '@@router/CALL_HISTORY_METHOD'
          ));
          expect(calledActions).to.deep.eql(expectedActions);

          const pushAction = store.getActions().filter(action => (
            action.type === '@@router/CALL_HISTORY_METHOD'
          ))[0];
          expect(pushAction.payload).to.deep.eql({
            method: 'push',
            args: ['/registration/success'],
          });

          expect(createUserApiRequestMock.mock.calls[0]).to.deep.eql([user]);
        });
    });
  });

  describe('registrationSetUserFirstName', () => {
    it('returns REGISTRATION_SET_FIRST_NAME action', () => {
      expect(registrationSetUserFirstName('Armin')).to.deep.equal({
        type: REGISTRATION_SET_FIRST_NAME,
        payload: 'Armin',
      });
    });
  });
});
