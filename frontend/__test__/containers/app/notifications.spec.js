import { expect } from '../../chai_helper';
import { mapStateToProps } from '../../../containers/app/notifications';

describe('Notifications Container', () => {
  describe('mapStateToProps', () => {
    it('returns the active notifications', () => {
      const state = {
        notifications: {
          active: [1, 2],
        },
      };

      const { activeNotifications } = mapStateToProps(state);

      expect(activeNotifications).to.deep.eql([1, 2]);
    });
  });
});
