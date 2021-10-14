import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Dashboard from "../../components/dashboard";

describe("<Dashboard/>", () => {
  it("should have navigation links", () => {
    const wrapper = shallow(<Dashboard location={{ pathname: "/" }} />, {
      context: { t: (v) => v },
    });
    expect(wrapper.find("nav")).to.have.length(1);
    expect(wrapper.find("nav li")).to.have.length(3);
    const listItems = wrapper.find("nav li");
    const expectedLinkTexts = ["My classes", "Teaching material", "News"];
    const expectedLinks = ["/classes", "/topics", "/posts"];
    const linkTexts = listItems.map((item) =>
      item.children().first().children().text()
    );
    const links = listItems.map((item) => item.children().first().props().to);
    expectedLinkTexts.forEach((expectedText) => {
      expect(linkTexts).to.include(expectedText);
    });
    expectedLinks.forEach((expectedLink) => {
      expect(links).to.include(expectedLink);
    });
  });

  it("sets is--active class for active list item", () => {
    const wrapper = mount(<Dashboard location={{ pathname: "/classes" }} />, {
      context: { t: (v) => v },
    });
    expect(wrapper.find("nav li")).to.have.length(3);
    let listItems = wrapper.find(".itemIsActive");
    expect(listItems.length).to.equal(1);
    expect(listItems.text()).to.equal("My classes");

    wrapper.setProps({ location: { pathname: "/topics" } });
    listItems = wrapper.find(".itemIsActive");
    expect(listItems.length).to.equal(1);
    expect(listItems.text()).to.equal("Teaching material");

    wrapper.setProps({ location: { pathname: "/posts" } });
    listItems = wrapper.find(".itemIsActive");
    expect(listItems.length).to.equal(1);
    expect(listItems.text()).to.equal("News");
  });

  it("should render children", () => {
    const wrapper = shallow(
      <Dashboard location={{ pathname: "/" }}>
        <span className="a-test" />
      </Dashboard>,
      { context: { t: (v) => v } }
    );

    expect(wrapper.contains(<span className="a-test" />)).to.equal(true);
  });

  it("displays activityIndicator for /posts if unreadPostsPresent is true", () => {
    const wrapper = shallow(
      <Dashboard location={{ pathname: "/" }} unreadPostsPresent />,
      {
        context: { t: (v) => v },
      }
    );

    expect(
      wrapper.find('Link[to="/posts"]').find(".activityIndicator")
    ).to.have.length(1);
  });

  it("does not display activityIndicator if unreadPostsPresent is false", () => {
    const wrapper = shallow(
      <Dashboard location={{ pathname: "/" }} unreadPostsPresent={false} />,
      {
        context: { t: (v) => v },
      }
    );

    expect(wrapper.find(".activityIndicator")).to.have.length(0);
  });
});
