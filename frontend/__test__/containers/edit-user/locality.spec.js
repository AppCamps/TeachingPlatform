import pick from "lodash.pick";

import { expect } from "../../chai_helper";
import TestStore from "../../orm-helper";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/edit-user/locality";

describe("Edit User Locality Container", () => {
  describe("mapStateToProps", () => {
    let store;
    beforeEach(() => {
      store = new TestStore();
    });

    it("calls includes localityMapStateToProps in props", () => {
      const { factory, state } = store;
      factory.create("user");

      const localityMapStateToPropsResult = {
        test: 1234,
      };
      const localityMapStateToPropsMock = jest.fn(
        () => localityMapStateToPropsResult
      );
      containerRewire.__Rewire__(
        "localityMapStateToProps",
        localityMapStateToPropsMock
      );

      const props = mapStateToProps(state);

      expect(props).to.include(localityMapStateToPropsResult);
    });

    describe("initialValues", () => {
      it("returns initialValues", () => {
        const { factory, state } = store;
        const locality = factory.create("courseInstructorLocality");
        factory.create("user", { locality: locality.id });

        const { initialValues } = mapStateToProps(state);

        expect(initialValues).to.deep.eql(
          pick(locality, [
            "schoolType",
            "schoolTypeCustom",
            "schoolName",
            "subjects",
            "state",
            "country",
            "postalCode",
            "city",
          ])
        );
      });

      it("returns null if no locality is present", () => {
        const { factory, state } = store;
        factory.create("user", { locality: null });

        const { initialValues } = mapStateToProps(state);

        expect(initialValues).to.deep.eql({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("createLocality", () => {
      const createLocality = jest.fn();
      containerRewire.__Rewire__("createLocality", createLocality);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.createLocality("test");

      expect(createLocality.mock.calls[0]).to.deep.equal(["test"]);
    });

    it("createLocality", () => {
      const fetchCountries = jest.fn();
      containerRewire.__Rewire__("fetchCountries", fetchCountries);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.fetchCountries("test");
      expect(fetchCountries.mock.calls).to.have.length(1);
    });
  });
});
