import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
  NOTIFICATION_DISPLAY_REQUEST,
} from "../constants/notifications";

export function showNotification(definition) {
  return {
    type: NOTIFICATION_SHOW,
    payload: definition,
  };
}

export function hideNotification(definition) {
  return {
    type: NOTIFICATION_HIDE,
    payload: definition,
  };
}

export function requestNotification(definition) {
  return {
    type: NOTIFICATION_DISPLAY_REQUEST,
    payload: definition,
  };
}
