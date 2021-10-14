import React from "react";

import {
  trackError as trackJsError,
  log as trackJsLog,
} from "./services/trackjs";

export function trackError(error) {
  if (process.env.NODE_ENV === "production") {
    trackJsError(error);
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function log(...args) {
  if (process.env.NODE_ENV === "production") {
    trackJsLog(...args);
  } else {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

export function FeatureToggle(props) {
  const { FallbackComponent, children } = props;

  if (process.env.PREVIEW_FEATURES) {
    return children;
  }
  return FallbackComponent || null;
}
