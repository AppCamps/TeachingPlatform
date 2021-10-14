import React from "react";
import { replace } from "react-router-redux";
import { shallow } from "enzyme";

import TestStore from "../../orm-helper";
import {
  RedirectComponent,
  mapStateToProps,
  mapDispatchToProps,
} from "../../../containers/preparations/redirect";

describe("Preparations/Redirect Container + Component", () => {
  describe("mapStateToProps", () => {
    let store;
    beforeEach(() => {
      store = new TestStore();
    });

    it("returns slug of topic", () => {
      const { factory } = store;
      const topic = factory.create("topic");

      const { topicSlug } = mapStateToProps(store.state, {
        params: { topicSlug: topic.slug },
      });

      expect(topicSlug).toEqual(topic.slug);
    });
  });

  describe("mapDispatchToProps", () => {
    it("redirect", () => {
      const dispatch = (action) => action;
      const actions = mapDispatchToProps(dispatch);

      const topicSlug = "topicSlug";
      const result = actions.redirect(topicSlug);

      expect(result).toEqual(replace(`/topics/${topicSlug}/preparations`));
    });
  });

  describe("Component", () => {
    function defaultProps() {
      return {
        topicSlug: "topicSlug",
        redirect: jest.fn(),
      };
    }

    it("redirects to new url", () => {
      const props = defaultProps();
      const { redirect } = props;

      const wrapper = shallow(<RedirectComponent {...props} />);

      expect(wrapper.equals(<div />)).toEqual(true);

      expect(redirect.mock.calls).toHaveLength(1);
      expect(redirect.mock.calls[0]).toEqual(["topicSlug"]);
    });
  });
});
