/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';

import { normalizedSuccessResponse } from '../fixtures/api/createUser';

import {
  createLocality,
  __RewireAPI__ as RewireAPI,
} from '../../actions/locality';

import { API_FETCHED } from '../../constants/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('actions/locality', () => {
  let createLocalityMock;
  beforeEach(() => {
    createLocalityMock = jest.fn(() => Promise.resolve(normalizedSuccessResponse));
    RewireAPI.__Rewire__('apiCallCreateLocality', createLocalityMock);
  });

  describe('createLocality', () => {
    it('dispatches API_FETCHED on success', () => {
      const formValues = {
        country: 'DEU',
        state: 'bw',
        postalCode: '12345',
        city: 'Paris',
      };

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore();
      return store
        .dispatch(createLocality(formValues))
        .then(() => {
          expect(store.getActions()).to.deep.eql(expectedActions);
        });
    });

    it('works for non-teachers with "normal" values + upcases state', () => {
      const formValues = {
        country: 'DEU',
        state: 'bw',
        postalCode: '12345',
        city: 'Paris',
      };

      const store = mockStore();
      return store
        .dispatch(createLocality(formValues))
        .then(() => {
          expect(createLocalityMock.mock.calls[0][0]).to.deep.eql({
            country: 'DEU',
            state: 'BW',
            postalCode: '12345',
            city: 'Paris',
          });
        });
    });

    it('works for teachers with "normal" values', () => {
      const formValues = {
        schoolType: 'school_type_university',
        schoolName: 'L\'ecole de Paris',
        country: 'FRA',
        state: '1',
        postalCode: '12345',
        city: 'Paris',
      };

      const store = mockStore();
      return store
        .dispatch(createLocality(formValues))
        .then(() => {
          expect(createLocalityMock.mock.calls[0][0]).to.deep.eql({
            schoolType: 'school_type_university',
            schoolName: 'L\'ecole de Paris',
            country: 'FRA',
            state: '1',
            postalCode: '12345',
            city: 'Paris',
          });
        });
    });


    it('sets school_type to custom on schoolTypeCustom', () => {
      const formValues = {
        schoolType: 'Test school',
        schoolTypeCustom: 'Test school',
        schoolName: 'Harvard',
        country: 'FRA',
        state: '0',
        postalCode: '12345',
        city: 'Paris',
      };

      const store = mockStore();
      return store
        .dispatch(createLocality(formValues))
        .then(() => {
          expect(createLocalityMock.mock.calls[0][0]).to.deep.eql({
            schoolType: 'school_type_custom',
            schoolTypeCustom: 'Test school',
            schoolName: 'Harvard',
            country: 'FRA',
            state: '0',
            postalCode: '12345',
            city: 'Paris',
          });
        });
    });
  });
});
