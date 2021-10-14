import { delay } from "redux-saga";
import { call, put, takeEvery, fork, select, all } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";

import { NOTIFICATION_DISPLAY_REQUEST } from "../constants/notifications";

import { activeNotificationsSelector } from "../selectors/notifications";

import { showNotification, hideNotification } from "../actions/notifications";

export const NOTIFICATIONS_MAX = 2;
export const NOTIFICATIONS_DISPLAY_TIME = 10000;

let pendingNotifications = [];
let activeNotifications = [];

export function* handleLocationChange() {
  const displayedNotifications = yield select(activeNotificationsSelector);
  const notificationToCancel = displayedNotifications.filter(
    (notif) => notif.hideOnLocationChange
  );

  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const index in notificationToCancel) {
    const notif = notificationToCancel[index];
    yield put(hideNotification(notif));
  }
}

export function* displayNotification(notification) {
  if (activeNotifications.length >= NOTIFICATIONS_MAX) {
    throw new Error(
      `can't display more than ${NOTIFICATIONS_MAX} at the same time`
    );
  }
  activeNotifications = [...activeNotifications, notification];
  yield put(showNotification(notification));
  yield call(delay, notification.displayTime || NOTIFICATIONS_DISPLAY_TIME);
  yield put(hideNotification(notification));
  activeNotifications = activeNotifications.filter((n) => n !== notification);
}

export function* notificationScheduler() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (
      activeNotifications.length < NOTIFICATIONS_MAX &&
      pendingNotifications.length > 0
    ) {
      const [firstNotification, ...remainingNotifications] =
        pendingNotifications;
      pendingNotifications = remainingNotifications;
      yield fork(displayNotification, firstNotification);

      // Add little delay so that 2 concurrent 2 notifications aren't displayed at the same time
      yield call(delay, 300);
    } else {
      yield call(delay, 50);
    }
  }
}

// eslint-disable-next-line require-yield
export function* handleNotificationRequest(action) {
  const newNotification = {
    ...action.payload,
    key: Date.now(),
  };
  pendingNotifications = [...pendingNotifications, newNotification];
}

export default function* watchNofitications() {
  yield all([
    takeEvery(NOTIFICATION_DISPLAY_REQUEST, handleNotificationRequest),
    takeEvery(LOCATION_CHANGE, handleLocationChange),
    call(notificationScheduler),
  ]);
}

// methods used for testing
/* eslint-disable no-eval, no-unused-vars */
export const setTest = (varName, value) => {
  eval(`${varName} = value`);
};
export const getTest = (varName) => eval(`${varName}`);
