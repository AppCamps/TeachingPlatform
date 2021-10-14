import { expect } from "../../chai_helper";
import TestStore from "../../orm-helper";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/edit-user";

describe("EditUser Container", () => {
  describe("mapStateToProps", () => {
    let store;
    beforeEach(() => {
      store = new TestStore();
    });

    it("returns the user", () => {
      const {
        session: { User },
        factory,
        state,
      } = store;
      factory.create("user");

      const { user } = mapStateToProps(state);

      expect(user).to.deep.eql({ ...User.last().includeRef });
    });

    it("returns initialValues", () => {
      const { factory, state } = store;
      const { email, firstName, lastName } = factory.create("user");

      const { initialValues } = mapStateToProps(state);

      expect(initialValues).to.deep.eql({ email, firstName, lastName });
    });

    it("returns unconfirmedEmail over email", () => {
      const { factory, state } = store;
      const { unconfirmedEmail, firstName, lastName } = factory.create("user", {
        unconfirmedEmail: Faker.internet.email,
      });

      const { initialValues } = mapStateToProps(state);

      expect(initialValues).to.deep.eql({
        email: unconfirmedEmail,
        firstName,
        lastName,
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("updateUser", () => {
      const updateUser = jest.fn();
      containerRewire.__Rewire__("updateUser", updateUser);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.updateUser("test");

      expect(updateUser.mock.calls[0]).to.deep.equal(["test"]);
    });
  });
});
