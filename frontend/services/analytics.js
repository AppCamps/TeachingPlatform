export function setAnalyticsUserId(userId) {
  window.ga("set", "userId", userId);
}

export function trackAnalyticsEvent(eventCategory, eventAction) {
  window.ga("send", "event", { eventCategory, eventAction });
}
