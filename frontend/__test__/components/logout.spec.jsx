import React from "react";
import { mount } from "enzyme";

import { expect } from "../chai_helper";

import Logout from "../../components/logout";

describe("<Logout />", () => {
  it("renders calls logoutUser on componentDidMount", () => {
    const logoutUser = jest.fn();
    const wrapper = mount(<Logout logoutUser={logoutUser} />);

    expect(wrapper).to.contain(<div />);
    expect(logoutUser.mock.calls).to.have.length(1);
  });
});
