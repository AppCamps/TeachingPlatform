import { expect } from '../chai_helper';

import { setAnalyticsUserId } from '../../services/analytics';

describe('analytics service', () => {
  let calledArgs;
  beforeEach(() => {
    calledArgs = [];
    global.ga = (...args) => {
      calledArgs.push(args);
    };
  });

  afterEach(() => {
    delete global.ga;
  });

  describe('setAnalyticsUserId', () => {
    it('sets userId for google analytics', () => {
      setAnalyticsUserId('thoren-12');

      expect(calledArgs[0]).to.deep.eql(['set', 'userId', 'thoren-12']);
    });
  });
});
