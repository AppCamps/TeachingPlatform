import { PAGINATION_FETCHED } from '../../constants/pagination';

import paginationReducer from '../../reducers/pagination';

describe('paginationReducer', () => {
  it('should return the initial state', () => {
    expect(paginationReducer(undefined, { type: 'none' })).toEqual({});
  });

  it('should return the state for a given identifier', () => {
    expect(paginationReducer({}, { type: PAGINATION_FETCHED, identifier: 'posts' })).toEqual({
      posts: {},
    });
  });

  it('should save payload for given identifier', () => {
    expect(
      paginationReducer({}, { type: PAGINATION_FETCHED, identifier: 'posts', payload: 'test' }),
    ).toEqual({
      posts: 'test',
    });
  });
});
