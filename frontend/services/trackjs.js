export function setTrackJsUserId(userId) {
  if (!window.trackJs) {
    return;
  }
  window.trackJs.configure({ userId });
}

export function trackError(error) {
  if (!window.trackJs) {
    return;
  }
  window.trackJs.track(error);
}

export function log(...args) {
  if (!window.trackJs) {
    return;
  }
  window.trackJs.console.log(...args);
}
