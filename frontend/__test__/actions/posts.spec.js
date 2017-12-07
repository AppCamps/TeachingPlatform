/* eslint no-underscore-dangle: 0 */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { fetchPosts, __RewireAPI__ as RewireAPI } from '../../actions/posts';

import { API_FETCHED } from '../../constants/api';
import { PAGINATION_FETCHED } from '../../constants/pagination';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/posts', () => {
  describe('fetchPosts', () => {
    it('should fetch courses from api and dispatch coursesFetched and dispatch updateUser with unreadPostsPresent: false', () => {
      const postsApiResponse = {
        data: [
          {
            posts: [
              {
                '1234-5678': {
                  title: 'hellp',
                },
              },
            ],
          },
        ],
        links: {
          self: 'page[number]=2&page[size]=5',
        },
      };

      const userApiResponse = [
        {
          users: [
            {
              12: {
                firstName: 'Mario',
                unreadPostsPresent: false,
              },
            },
          ],
        },
      ];

      const getPostsMock = jest.fn(() => Promise.resolve(postsApiResponse));
      const updateUserMock = jest.fn(() => Promise.resolve(userApiResponse));

      RewireAPI.__Rewire__('getPosts', getPostsMock);
      RewireAPI.__Rewire__('updateUser', updateUserMock);

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: [
            {
              posts: [
                {
                  '1234-5678': {
                    title: 'hellp',
                  },
                },
              ],
            },
          ],
        },
        {
          type: PAGINATION_FETCHED,
          identifier: 'posts',
          payload: {
            current: 2,
            size: 5,
            self: 2,
          },
        },
        {
          type: API_FETCHED,
          payload: [
            {
              users: [
                {
                  12: {
                    firstName: 'Mario',
                    unreadPostsPresent: false,
                  },
                },
              ],
            },
          ],
        },
      ];

      const fragments = { number: 2, size: 5 };
      const user = { id: '12', firstName: 'Mario', unreadPostsPresent: true };

      const store = mockStore({ api: { posts: {} } });

      store.dispatch(fetchPosts(fragments, user)).then(() => {
        expect(getPostsMock.mock.calls.length).toBe(1);
        expect(getPostsMock.mock.calls[0]).toEqual([fragments]);
        expect(updateUserMock.mock.calls.length).toBe(1);
        expect(updateUserMock.mock.calls[0]).toEqual([{ ...user, unreadPostsPresent: false }]);
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('not updateUser with unreadPostsPresent: false if unreadPostsPresent was false', () => {
      const postsApiResponse = {
        data: [
          {
            posts: [
              {
                '1234-5678': {
                  title: 'hellp',
                },
              },
            ],
          },
        ],
        links: {
          self: 'page[number]=2&page[size]=5',
        },
      };

      const getPostsMock = jest.fn(() => Promise.resolve(postsApiResponse));
      const updateUserMock = jest.fn();

      RewireAPI.__Rewire__('getPosts', getPostsMock);
      RewireAPI.__Rewire__('updateUser', updateUserMock);

      const expectedActions = [
        {
          type: API_FETCHED,
          payload: [
            {
              posts: [
                {
                  '1234-5678': {
                    title: 'hellp',
                  },
                },
              ],
            },
          ],
        },
        {
          type: PAGINATION_FETCHED,
          identifier: 'posts',
          payload: {
            current: 2,
            size: 5,
            self: 2,
          },
        },
      ];

      const fragments = { number: 2, size: 5 };
      const user = { id: '12', firstName: 'Mario', unreadPostsPresent: false };

      const store = mockStore({ api: { posts: {} } });

      store.dispatch(fetchPosts(fragments, user)).then(() => {
        expect(updateUserMock.mock.calls.length).toBe(0);
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
