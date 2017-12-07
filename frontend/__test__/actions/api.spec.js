import { expect } from '../chai_helper';

import { apiFetched } from '../../actions/api';
import { API_FETCHED } from '../../constants/api';

describe('apiFetched', () => {
  it('returns action with payload', () => {
    const payload = {};
    expect(apiFetched(payload)).to.deep.equal({
      type: API_FETCHED,
      payload,
    });
  });
});
