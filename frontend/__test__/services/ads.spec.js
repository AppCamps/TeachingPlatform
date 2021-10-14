import { expect } from "../chai_helper";

import { trackRegistrationConversion } from "../../services/ads";

describe("ads service", () => {
  const prevEnv = process.env.NODE_ENV;
  let trackMock;
  beforeEach(() => {
    trackMock = jest.fn();
    global.google_trackConversion = trackMock;
  });

  afterEach(() => {
    process.env.NODE_ENV = prevEnv;
    delete global.google_trackConversion;
  });

  describe("trackRegistrationConversion", () => {
    it("sets fires conversion tracking event for registration", () => {
      process.env.NODE_ENV = "production";

      trackRegistrationConversion();

      expect(trackMock.mock.calls[0][0]).to.deep.eql({
        google_conversion_id: process.env.GOOGLE_ANALYTICS_CONVERSION_ID,
        google_conversion_language: "en",
        google_conversion_format: "3",
        google_conversion_color: "ffffff",
        google_conversion_label: process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL,
        google_remarketing_only: false,
      });
    });

    it("does not fires conversion tracking events in !production env", () => {
      process.env.NODE_ENV = "development";

      trackRegistrationConversion();

      expect(trackMock.mock.calls).to.have.length(0);
    });

    it("does not fires conversion tracking events when google_trackConversion does not exist", () => {
      delete global.google_trackConversion;

      trackRegistrationConversion();

      expect(trackMock.mock.calls).to.have.length(0);
    });
  });
});
