import { expect } from '../chai_helper';

import { paginationFetched } from '../../actions/pagination';
import { PAGINATION_FETCHED } from '../../constants/pagination';

describe('paginationiFetched', () => {
  it('returns action with payload', () => {
    const links = {
      self: 'https://asd.asd/asd?page[number]=2&page[size]=1',
      next: 'https://asd.asd/asd?page[number]=3&page[size]=1',
      prev: 'https://asd.asd/asd?page[number]=1&page[size]=1',
    };
    expect(paginationFetched('records', links)).to.deep.equal({
      type: PAGINATION_FETCHED,
      identifier: 'records',
      payload: {
        size: 1,
        current: 2,
        prev: 1,
        self: 2,
        next: 3,
      },
    });
  });
});
