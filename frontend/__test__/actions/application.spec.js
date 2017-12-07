import { expect } from '../chai_helper';

import { resetApplicationState } from '../../actions/application';
import { APPLICATION_STATE_RESET } from '../../constants/application';


describe('resetApplicationState', () => {
  it('returns action with payload', () => {
    expect(resetApplicationState()).to.deep.equal({
      type: APPLICATION_STATE_RESET,
    });
  });
});
