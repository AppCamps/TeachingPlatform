function trackConversion(conversionObject) {
  if (process.env.NODE_ENV !== "production" || !window.google_trackConversion) {
    return;
  }
  window.google_trackConversion(conversionObject);
}

export function trackRegistrationConversion() {
  trackConversion({
    google_conversion_id: process.env.GOOGLE_ANALYTICS_CONVERSION_ID,
    google_conversion_language: "en",
    google_conversion_format: "3",
    google_conversion_color: "ffffff",
    google_conversion_label: process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL,
    google_remarketing_only: false,
  });
}
