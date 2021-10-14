import { expect } from "../../chai_helper";
import TestStore from "../../orm-helper";

import { schoolTypes } from "../../../config";

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from "../../../containers/login/locality";

describe("Classes Container", () => {
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

      expect(user).to.deep.eql({
        ...User.last().includeRef,
        isPersisted: false,
      });
    });

    it("returns all countries and countryOptions", () => {
      const {
        session: { Country },
        factory,
        state,
      } = store;
      factory.createList("country", 3);

      const countries = Country.all().toRefArray();
      const props = mapStateToProps(state);

      expect(props.countries).to.have.length(3);
      props.countries.forEach((classRef, index) => {
        expect(classRef).to.deep.equal(countries[index]);
      });

      props.countryOptions.forEach((option, index) => {
        const { value, name } = countries[index];
        expect(option).to.deep.equal({ value, label: name });
      });
    });

    it("returns selectedCountry for matched country", () => {
      const {
        session: { Country },
        factory,
        state,
      } = store;
      factory.createList("country", 3);
      const selectedCountry = Country.first().ref;

      containerRewire.__Rewire__("getFormValues", () => () => ({
        country: selectedCountry.value,
      }));

      const props = mapStateToProps(state);

      expect(props.selectedCountry).to.deep.equal(selectedCountry);
      expect(props.countryCustom).not.to.be.ok;
    });

    it("returns stateOptions for selectedCountry", () => {
      const {
        session: { Country },
        factory,
        state,
      } = store;
      factory.createList("country", 1, {}, { stateCount: 5 });
      const selectedCountry = Country.first().ref;
      const states = selectedCountry.states;
      const stateKeys = Object.keys(selectedCountry.states);

      containerRewire.__Rewire__("getFormValues", () => () => ({
        country: selectedCountry.value,
      }));

      const props = mapStateToProps(state);
      props.stateOptions.forEach((option, index) => {
        const stateKey = stateKeys[index];
        expect(option).to.deep.equal({
          value: stateKey,
          label: states[stateKey],
        });
      });
    });

    it("upcases stateOptions for string values", () => {
      const {
        session: { Country },
        factory,
        state,
      } = store;
      factory.createList(
        "country",
        1,
        {
          states: { bb: "Brandenburg", hh: "Hamburg", 2: "Kärnten" },
        },
        { stateCount: 0 }
      );
      const selectedCountry = Country.first().ref;
      containerRewire.__Rewire__("getFormValues", () => () => ({
        country: selectedCountry.value,
        state: "HH",
      }));

      const { stateOptions } = mapStateToProps(state);

      expect(stateOptions).to.deep.equal([
        { value: "2", label: "Kärnten" },
        { value: "BB", label: "Brandenburg" },
        { value: "HH", label: "Hamburg" },
      ]);
    });

    it("returns schoolTypeCustom", () => {
      const { state } = store;

      containerRewire.__Rewire__("getFormValues", () => () => ({
        schoolType: "Test",
      }));

      expect(mapStateToProps(state).schoolTypeCustom).to.eql("Test");

      containerRewire.__Rewire__("getFormValues", () => () => ({
        schoolType: Object.keys(schoolTypes)[0],
      }));

      expect(mapStateToProps(state).schoolTypeCustom).not.to.be.ok;
    });
  });

  describe("mapDispatchToProps", () => {
    it("createLocality", () => {
      const createInitialLocality = jest.fn();
      containerRewire.__Rewire__(
        "createInitialLocality",
        createInitialLocality
      );

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.createLocality("test");

      expect(createInitialLocality.mock.calls).to.have.length(1);
      expect(createInitialLocality.mock.calls[0]).to.deep.equal(["test"]);
    });

    it("fetchCountries", () => {
      const fetchCountries = jest.fn();
      containerRewire.__Rewire__("fetchCountries", fetchCountries);

      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      actions.fetchCountries("test");
      expect(fetchCountries.mock.calls).to.have.length(1);
    });
  });
});
