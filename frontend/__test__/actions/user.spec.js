/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';

import { user, normalizedSuccessResponse } from '../fixtures/api/createUser';

import {
  updateUser,
  __RewireAPI__ as RewireAPI,
} from '../../actions/user';

import { API_FETCHED } from '../../constants/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('User actions', () => {
  describe('updateUser', () => {
    it("should send update request to api and dispatch apiFetched and push('/registration/success')", () => {
      const updateUserApiRequestMock = jest.fn(() => Promise.resolve(normalizedSuccessResponse));
      RewireAPI.__Rewire__(
        'updateUserApiRequest',
        updateUserApiRequestMock,
      );

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({});
      return store
        .dispatch(updateUser(user))
        .then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);
          expect(updateUserApiRequestMock.mock.calls[0]).to.deep.eql([user]);
        });
    });
  });
});
