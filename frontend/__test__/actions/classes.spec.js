/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { expect } from '../chai_helper';
import factory from '../__factories__';

import { normalizedSuccessResponse } from '../fixtures/api/getClasses';

import {
  fetchClasses,
  createClass,
  updateClass,
  markLessonAsComplete,
  markLessonAsIncomplete,
  showAllClasses,
  showTopClasses,
  toggleClass,
  __RewireAPI__ as RewireAPI,
} from '../../actions/classes';

import ClassSerializer from '../../serializers/class';

import { API_FETCHED } from '../../constants/api';
import { SHOW_ALL, SHOW_TOP, TOGGLE_CLASS } from '../../constants/classes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/classes', () => {
  describe('fetchClasses', () => {
    it('should fetch classes from api and dispatch apiFetched', () => {
      RewireAPI.__Rewire__('getClasses', () => Promise.resolve(normalizedSuccessResponse));

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({ api: { classes: {}, topics: {}, lessons: {} } });
      return store.dispatch(fetchClasses()).then(() => {
        expect(store.getActions()).to.deep.eql(expectedActions);
      });
    });
  });

  describe('createClass', () => {
    it("should send create request to api and dispatch apiFetched and push('/classes')", () => {
      RewireAPI.__Rewire__('_createClass', () => Promise.resolve(normalizedSuccessResponse));

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({ api: { classes: {}, topics: {}, lessons: {} } });
      return (
        store
          /* eslint-disable react/prefer-es6-class */
          .dispatch(
            createClass({
              /* eslint-enable react/prefer-es6-class */
              resourceType: 'school_class',
            }),
          )
          .then(() => {
            const calledActions = store
              .getActions()
              .filter(action => action.type !== '@@router/CALL_HISTORY_METHOD');
            expect(calledActions).to.deep.eql(expectedActions);

            const pushAction = store
              .getActions()
              .filter(action => action.type === '@@router/CALL_HISTORY_METHOD')[0];
            expect(pushAction.payload).to.deep.eql({
              method: 'push',
              args: ['/classes'],
            });
          })
      );
    });
  });

  describe('updateClass', () => {
    it("should send create request to api and dispatch apiFetched and push('/classes')", () => {
      const updateClassApiMock = jest.fn(() => Promise.resolve(normalizedSuccessResponse));
      RewireAPI.__Rewire__('_updateClass', updateClassApiMock);

      const klass = factory.build('class');

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({});
      const klassDataWithoutId = { ...klass };
      delete klassDataWithoutId.id;
      const formData = {
        ...klassDataWithoutId,
        className: 'Test123',
      };

      const expectedResult = ClassSerializer.serialize({ ...formData, id: klass.id });

      return store.dispatch(updateClass(klass.id, formData)).then(() => {
        expect(updateClassApiMock.mock.calls.length).to.eql(1);
        expect(updateClassApiMock.mock.calls[0]).to.deep.eql([klass.id, expectedResult]);

        const calledActions = store
          .getActions()
          .filter(action => action.type !== '@@router/CALL_HISTORY_METHOD');
        expect(calledActions).to.deep.eql(expectedActions);

        const pushAction = store
          .getActions()
          .filter(action => action.type === '@@router/CALL_HISTORY_METHOD')[0];
        expect(pushAction.payload).to.deep.eql({
          method: 'push',
          args: ['/classes'],
        });
      });
    });
  });

  describe('markLessonAsComplete', () => {
    it('should send patch request to api and dispatch apiFetched', () => {
      const updateCompletedLessonsRelationMock = jest.fn(() =>
        Promise.resolve(normalizedSuccessResponse),
      );
      const klass = factory.build('class');
      const lesson = factory.build('lesson');

      RewireAPI.__Rewire__('updateCompletedLessonsRelation', updateCompletedLessonsRelationMock);

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({
        api: {
          classes: { [`${klass.id}`]: klass },
          lessons: { [`${lesson.id}`]: lesson },
        },
      });

      return store.dispatch(markLessonAsComplete(klass, lesson)).then(() => {
        expect(store.getActions()).to.deep.eql(expectedActions);
        expect(updateCompletedLessonsRelationMock.mock.calls[0]).to.deep.eql([
          klass.id,
          {
            data: [
              {
                type: 'completedLessons',
                id: lesson.id,
              },
            ],
          },
        ]);
      });
    });
  });

  describe('markLessonAsIncomplete', () => {
    it('should send delete request to api and dispatch apiFetched', () => {
      const deleteCompletedLessonsRelationMock = jest.fn(() =>
        Promise.resolve(normalizedSuccessResponse),
      );
      const klass = factory.build('class');
      const lesson = factory.build('lesson');

      RewireAPI.__Rewire__('deleteCompletedLessonsRelation', deleteCompletedLessonsRelationMock);

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({
        api: {
          classes: { [`${klass.id}`]: klass },
          lessons: { [`${lesson.id}`]: lesson },
        },
      });

      return store.dispatch(markLessonAsIncomplete(klass, lesson)).then(() => {
        expect(store.getActions()).to.deep.eql(expectedActions);
        expect(deleteCompletedLessonsRelationMock.mock.calls[0]).to.deep.eql([
          klass.id,
          {
            data: [
              {
                type: 'completedLessons',
                id: lesson.id,
              },
            ],
          },
        ]);
      });
    });
  });

  describe('showAllClasses', () => {
    it('dispatches action', () => {
      const result = showAllClasses()(res => res);
      expect(result).to.deep.equal({ type: SHOW_ALL });
    });
  });

  describe('showTopClasses', () => {
    it('dispatches action', () => {
      const result = showTopClasses()(res => res);
      expect(result).to.deep.equal({ type: SHOW_TOP });
    });
  });

  describe('toggleClass', () => {
    it('dispatches action', () => {
      const result = toggleClass({ id: 'classId' })(res => res);
      expect(result).to.deep.equal({ type: TOGGLE_CLASS, id: 'classId' });
    });
  });
});
