import { expect } from "../chai_helper";

import { isAuthenticated } from "../../services/auth";

describe("Auth", () => {
  describe("isAuthenticated", () => {
    it("requires a user with privacyPolicyAccepted and locality", () => {
      const user = {};
      expect(isAuthenticated(user)).to.equal(false);
      expect(isAuthenticated({ privacyPolicyAccepted: true })).to.equal(false);
      expect(isAuthenticated({ locality: {} })).to.equal(false);

      const authenticatedUser = {
        privacyPolicyAccepted: true,
        locality: true,
      };
      expect(isAuthenticated(authenticatedUser)).to.equal(true);
    });
  });
});
