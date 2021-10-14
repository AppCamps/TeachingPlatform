import { expect } from "../../chai_helper";

import {
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/password-reset";

describe("Password Reset Container", () => {
  describe("mapDispatchToProps", () => {
    it("passwordResetRequest", () => {
      const passwordResetRequestMock = jest.fn();
      containerRewire.__Rewire__(
        "passwordResetRequest",
        passwordResetRequestMock
      );

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const formData = {};
      actions.passwordResetRequest(formData);
      expect(passwordResetRequestMock.mock.calls[0]).to.eql([formData]);
    });
  });
});
