import { expect } from "../chai_helper";

import { setTrackJsUserId } from "../../services/trackjs";

describe("trackjs service", () => {
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

  describe("setTrackJsUserId", () => {
    it("sets userId for trackjs", () => {
      setTrackJsUserId("thoren-12");

      expect(calledArgs[0]).to.deep.eql([{ userId: "thoren-12" }]);
    });
  });
});
