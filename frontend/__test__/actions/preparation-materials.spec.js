/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';

import { normalizedSuccessResponse } from '../fixtures/api/getPreparationMaterials';

import {
  fetchPreparationMaterials,
  __RewireAPI__ as RewireAPI,
} from '../../actions/preparation-materials';

import { API_FETCHED } from '../../constants/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/preparations', () => {
  describe('fetchPreparationMaterials', () => {
    it('should fetch preperationMaterials from api and dispatch API_FETCHED', () => {
      RewireAPI.__Rewire__('getPreparationMaterials', () =>
        Promise.resolve(normalizedSuccessResponse),
      );

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({ api: { topics: {} } });
      return store.dispatch(fetchPreparationMaterials()).then(() => {
        expect(store.getActions()).to.deep.eql(expectedActions);
      });
    });
  });
});
