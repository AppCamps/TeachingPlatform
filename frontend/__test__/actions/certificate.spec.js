/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import factory from '../__factories__';

import { normalizedSuccessResponse, requestData } from '../fixtures/api/updateCourseSchoolClass';

import { downloadCertificate, __RewireAPI__ as RewireAPI } from '../../actions/certificate';

import { API_FETCHED } from '../../constants/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/classes', () => {
  describe('downloadCertificate', () => {
    const windowOpen = window.open;
    beforeEach(() => {
      window.open = jest.fn();
    });
    afterEach(() => {
      window.open = windowOpen;
    });

    describe('courseSchoolClass.certificate already downloaded', () => {
      it('should send not send request and download certificate', (done) => {
        const courseSchoolClass = factory.build('courseSchoolClass', {
          certificateDownloaded: true,
        });

        const updateCourseSchoolClass = jest.fn();
        RewireAPI.__Rewire__('updateCourseSchoolClass', updateCourseSchoolClass);

        const store = mockStore({});

        return store
          .dispatch(downloadCertificate(courseSchoolClass))
          .then(() => {
            expect(updateCourseSchoolClass.mock.calls).toHaveLength(0);

            expect(window.open.mock.calls).toHaveLength(1);
            expect(window.open.mock.calls[0]).toEqual([courseSchoolClass.certificateUrl, '_self']);

            done();
          })
          .catch(done.fail);
      });
    });

    describe('courseSchoolClass.certificate not downloaded yet', () => {
      it('should send create request to api and dispatch apiFetched and download certificate', (done) => {
        const courseSchoolClass = factory.build('courseSchoolClass', {
          certificateDownloaded: false,
          certificateUrl: null,
        });

        const response = normalizedSuccessResponse(courseSchoolClass);

        const updateCourseSchoolClass = jest.fn(() => Promise.resolve(response));
        RewireAPI.__Rewire__('updateCourseSchoolClass', updateCourseSchoolClass);

        const expectedActions = [
          {
            type: API_FETCHED,
            payload: response,
          },
        ];

        const store = mockStore({});
        const expectedResult = JSON.parse(requestData(courseSchoolClass));

        return store
          .dispatch(downloadCertificate(courseSchoolClass))
          .then(() => {
            expect(updateCourseSchoolClass.mock.calls).toHaveLength(1);
            expect(updateCourseSchoolClass.mock.calls[0]).toEqual([expectedResult]);

            expect(store.getActions()).toEqual(expectedActions);

            expect(window.open.mock.calls).toHaveLength(1);
            expect(window.open.mock.calls[0]).toEqual([
              response.courseSchoolClasses[courseSchoolClass.id].certificateUrl,
              '_self',
            ]);

            done();
          })
          .catch(done.fail);
      });
    });
  });
});
