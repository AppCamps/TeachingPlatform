import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import IFrame from "../../../components/atoms/a-iframe";

describe("<IFrame/>", () => {
  it("should have an iframe", () => {
    const wrapper = shallow(
      <IFrame src="//localhost/test" width={960} height={600} />
    );
    expect(wrapper.find("iframe")).to.have.length(1);
  });

  it("should have props given props", () => {
    const wrapper = shallow(
      <IFrame src="//localhost/test" width={960} height={600} />
    );

    expect(wrapper.props().src).to.eql("//localhost/test");
    expect(wrapper.props().width).to.eql("960px");
    expect(wrapper.props().height).to.eql("600px");
  });
});
