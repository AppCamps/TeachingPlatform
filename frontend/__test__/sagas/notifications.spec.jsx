import { testSaga } from 'redux-saga-test-plan';

import { delay } from 'redux-saga';
import { call, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { expect } from '../chai_helper';

import { activeNotificationsSelector } from '../../selectors/notifications';

import watchNofitications, {
  handleLocationChange,
  handleNotificationRequest,
  notificationScheduler,
  displayNotification,
  getTest,
  setTest,
  NOTIFICATIONS_MAX,
  NOTIFICATIONS_DISPLAY_TIME,
} from '../../sagas/notifications';

import { NOTIFICATION_DISPLAY_REQUEST } from '../../constants/notifications';

import { showNotification, hideNotification } from '../../actions/notifications';

describe('notification sagas', () => {
  describe('watchNofitications', () => {
    it('*watchAuthenticationPersistSession saga test', () => {
      testSaga(watchNofitications)
        .next()
        .all([
          takeEvery(NOTIFICATION_DISPLAY_REQUEST, handleNotificationRequest),
          takeEvery(LOCATION_CHANGE, handleLocationChange),
          call(notificationScheduler),
        ])
        .finish()
        .isDone();
    });
  });

  describe('hideNotificationsOnLocationChange', () => {
    it('does nothing of no notifications are active', () => {
      testSaga(handleLocationChange)
        .next()
        .select(activeNotificationsSelector)
        .next([])
        .isDone();
    });

    it('does puts hideNotification for filtered notifications', () => {
      const keep = { text: 'stay' };
      const hide = { text: 'go away', hideOnLocationChange: true };

      testSaga(handleLocationChange)
        .next()
        .select(activeNotificationsSelector)
        .next([keep, hide])
        .put(hideNotification(hide))
        .next()
        .isDone();
    });
  });

  describe('handleNotificationRequest', () => {
    it('*enques new notifications', () => {
      const existingNotification = {
        type: 'failure',
        text: 'Test notification',
        key: Date.now(),
      };

      const notificationDef = {
        type: 'success',
        text: 'Test notification',
      };

      const fn = handleNotificationRequest({
        type: NOTIFICATION_DISPLAY_REQUEST,
        payload: notificationDef,
      });

      setTest('pendingNotifications', [existingNotification]);

      fn.next();

      global.expect(getTest('pendingNotifications')).toEqual([
        existingNotification,
        global.expect.objectContaining({
          ...notificationDef,
          key: global.expect.any(Number),
        }),
      ]);
    });
  });

  describe('notificationScheduler', () => {
    it('forks displayNotification with pendingNotifications and loops', () => {
      const notif = {
        type: 'success',
        text: 'success notif',
        key: Date.now(),
      };

      setTest('activeNotifications', []);
      setTest('pendingNotifications', [notif]);

      const step = testSaga(notificationScheduler).next();

      expect(getTest('activeNotifications')).to.deep.eql([]);
      expect(getTest('pendingNotifications')).to.deep.eql([]);

      step.fork(displayNotification, notif)
        .next()
        .call(delay, 300)
        .next()
        .call(delay, 50)
        .finish()
        .isDone();
    });

    it('does only fork if pendingNotifications present', () => {
      setTest('activeNotifications', []);
      setTest('pendingNotifications', []);

      testSaga(notificationScheduler)
        .next()
        .call(delay, 50)
        .finish()
        .isDone();
    });

    it('does only fork if activeNotifications are less than NOTIFICATIONS_MAX', () => {
      setTest('activeNotifications', new Array(NOTIFICATIONS_MAX));
      setTest('pendingNotifications', [new Array(1)]);

      testSaga(notificationScheduler)
        .next()
        .call(delay, 50)
        .finish()
        .isDone();
    });
  });

  describe('displayNotification', () => {
    it('throws if more than NOTIFICATIONS_MAX', () => {
      setTest('activeNotifications', new Array(NOTIFICATIONS_MAX));

      expect(() => displayNotification('test').next()).to.throw(
        `can't display more than ${NOTIFICATIONS_MAX} at the same time`,
      );
    });

    it('shows given notification, waits and then hides it again', () => {
      const alreadyExistingNotif = { text: 'already existing notif' };
      setTest('activeNotifications', [alreadyExistingNotif]);
      const notif = { text: 'test' };

      const step = testSaga(displayNotification, notif)
                     .next();

      expect(getTest('activeNotifications')).to.deep.equal([alreadyExistingNotif, notif]);

      step
        .put(showNotification(notif))
        .next()
        .call(delay, NOTIFICATIONS_DISPLAY_TIME)
        .next()
        .put(hideNotification(notif))
        .next()
        .finish()
        .isDone();

      expect(getTest('activeNotifications')).to.deep.equal([alreadyExistingNotif]);
    });
  });
});
