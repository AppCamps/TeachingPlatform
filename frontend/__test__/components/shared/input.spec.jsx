import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import Input from "../../../components/shared/input";

describe("<Input/>", () => {
  it("should have an input", () => {
    const wrapper = shallow(
      <Input type="password" name="user[password]" placeholder="Kennwort123" />
    );
    expect(wrapper.find("input")).to.have.length(1);
  });

  it("should have props given props", () => {
    const wrapper = shallow(
      <Input type="password" name="user[password]" placeholder="Kennwort123" />
    );

    expect(wrapper.props().name).to.eql("user[password]");
    expect(wrapper.props().placeholder).to.eql("Kennwort123");
    expect(wrapper.props().type).to.eql("password");
  });
});
