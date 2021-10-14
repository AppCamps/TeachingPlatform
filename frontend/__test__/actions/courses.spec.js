/* eslint no-underscore-dangle: 0 */
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { expect } from "../chai_helper";

import { normalizedSuccessResponse } from "../fixtures/api/getCourses";

import {
  fetchCourses,
  __RewireAPI__ as RewireAPI,
} from "../../actions/courses";

import { API_FETCHED } from "../../constants/api";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("actions/courses", () => {
  describe("fetchCourses", () => {
    it("should fetch courses from api and dispatch coursesFetched", () => {
      RewireAPI.__Rewire__("getCourses", () =>
        Promise.resolve(normalizedSuccessResponse)
      );

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: normalizedSuccessResponse,
        },
      ];

      const store = mockStore({
        api: { courses: {}, topics: {}, lessons: {} },
      });
      return store.dispatch(fetchCourses()).then(() => {
        expect(store.getActions()).to.deep.eql(expectedActions);
      });
    });
  });
});
