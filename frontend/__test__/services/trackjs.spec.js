import { expect } from "../chai_helper";

import { setTrackJsUserId } from "../../services/trackjs";

describe("analytics service", () => {
  let calledArgs;
  beforeEach(() => {
    calledArgs = [];
    global.trackJs = {
      configure: (...args) => {
        calledArgs.push(args);
      },
    };
  });

  afterEach(() => {
    delete global.trackJs;
  });

  describe("setAnalyticsUserId", () => {
    it("sets userId for google analytics", () => {
      setTrackJsUserId("thoren-12");

      expect(calledArgs[0]).to.deep.eql([{ userId: "thoren-12" }]);
    });
  });
});
