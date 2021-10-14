import { expect } from "../../chai_helper";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/password-reset/reset-form";

describe("Password Reset Container", () => {
  describe("mapStateToProps", () => {
    describe("passwordResetToken", () => {
      it("should take token from parameters", () => {
        const props = mapStateToProps(
          {},
          {
            params: {
              passwordResetToken: "some-token",
            },
          }
        );

        expect(props.passwordResetToken).to.eql("some-token");
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("passwordReset", () => {
      const passwordResetMock = jest.fn();
      containerRewire.__Rewire__("passwordReset", passwordResetMock);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const formData = {};
      const passwordResetToken = "some-token";
      actions.passwordReset(formData, passwordResetToken);
      expect(passwordResetMock.mock.calls[0]).to.eql([
        formData,
        passwordResetToken,
      ]);
    });
  });
});
