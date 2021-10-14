import { expect } from "../chai_helper";

import {
  showNotification,
  hideNotification,
  requestNotification,
} from "../../actions/notifications";
import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
  NOTIFICATION_DISPLAY_REQUEST,
} from "../../constants/notifications";

describe("showNotification", () => {
  const notificationDefinition = {
    type: "success",
    text: "Hi!",
  };

  it("returns NOTIFICATION_SHOW and notification definition", () => {
    expect(showNotification(notificationDefinition)).to.deep.equal({
      type: NOTIFICATION_SHOW,
      payload: notificationDefinition,
    });
  });

  it("returns NOTIFICATION_HIDE and notification definition", () => {
    expect(hideNotification(notificationDefinition)).to.deep.equal({
      type: NOTIFICATION_HIDE,
      payload: notificationDefinition,
    });
  });

  it("returns NOTIFICATION_DISPLAY_REQUEST and notification definition", () => {
    expect(requestNotification(notificationDefinition)).to.deep.equal({
      type: NOTIFICATION_DISPLAY_REQUEST,
      payload: notificationDefinition,
    });
  });
});
