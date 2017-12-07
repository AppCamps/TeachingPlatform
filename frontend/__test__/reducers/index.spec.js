import { expect } from '../chai_helper';

import { APPLICATION_STATE_RESET } from '../../constants/application';
import rootReducer from '../../reducers';

describe('rootReducer', () => {
  it('should combine reducers', () => {
    expect(rootReducer(undefined, {})).to.have.keys([
      'routing',
      'orm',
      'form',
      'i18nState',
      'authentication',
      'pagination',
      'preparations',
      'notifications',
      'classes',
      'registration',
    ]);
  });

  it('should reset state on LOGOUT_USER', () => {
    const testState = { preparations: { some: 'test' } };
    expect(rootReducer(testState, { type: APPLICATION_STATE_RESET })).not.to.include({
      preparations: { some: 'test' },
    });
  });

  it('keep authentication state  on LOGOUT_USER', () => {
    const testState = { authentication: { some: 'test' } };
    const reducedState = rootReducer(testState, { type: APPLICATION_STATE_RESET });
    expect(reducedState.authentication).to.deep.equal({ some: 'test' });
  });
});
