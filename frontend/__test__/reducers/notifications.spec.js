import { expect } from '../chai_helper';

import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
} from '../../constants/notifications';

import reducer from '../../reducers/notifications';

describe('notificationsReducer', () => {
  it('sets default state to { active: [] }', () => {
    expect(reducer(undefined, {})).to.deep.equal({ active: [] });
  });

  const notificationDef = { text: 'new one' };

  describe('NOTIFICATION_SHOW', () => {
    it('adds notification to state', () => {
      const state = reducer(
        {
          active: [
            { text: 'existing' },
          ],
        }, {
          type: NOTIFICATION_SHOW,
          payload: notificationDef,
        },
      );

      expect(state).to.deep.equal({
        active: [{ text: 'existing' }, notificationDef],
      });
    });
  });

  describe('NOTIFICATION_HIDE', () => {
    it('adds notification to state', () => {
      const state = reducer(
        {
          active: [
            { text: 'existing' },
            notificationDef,
          ],
        },
        {
          type: NOTIFICATION_HIDE,
          payload: notificationDef,
        },
      );

      expect(state).to.deep.equal({
        active: [{ text: 'existing' }],
      });
    });
  });
});
