import React from "react";

import { mount } from "enzyme";
import { expect } from "../../../chai_helper";
import factory from "../../../__factories__";

import TeachingMaterial from "../../../../components/shared/lesson/teaching-material";

import Number from "../../../../components/shared/number";

describe("<TeachingMaterial/>", () => {
  let teachingMaterial = factory.build("teachingMaterial", {
    id: "1",
    title: "Test TeachingMaterial 1",
  });

  it("should contain TeachingMaterial Title", () => {
    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={0} />
    );

    expect(wrapper.find(".title")).to.have.text(teachingMaterial.title);
  });

  it("should contain Number", () => {
    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={3} />
    );

    expect(wrapper).to.contain(<Number number={3} />);
  });

  it("should contain img", () => {
    teachingMaterial = {
      ...teachingMaterial,
      image:
        "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150",
    };

    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={3} />
    );

    expect(wrapper).to.have.descendants("img");
    expect(wrapper.find("img").props().src).to.equal(teachingMaterial.image);
  });

  it("should contain Link to TeachingMaterial if teachingMaterial.isVideo()", () => {
    teachingMaterial = {
      ...teachingMaterial,
      isVideo: true,
      mediumType: "medium_type_video",
      link: "https://test.de",
    };
    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={3} />
    );
    expect(wrapper).to.have.descendants("a");
    expect(wrapper.find("a").props().href).to.equal(teachingMaterial.link);
    expect(wrapper.find("a").props().target).to.equal(
      TeachingMaterial.TARGET_ID
    );
  });

  it("should not contain Link to TeachingMaterial if !teachingMaterial.isVideo()", () => {
    teachingMaterial = {
      ...teachingMaterial,
      isVideo: false,
      mediumType: "medium_type_other",
    };
    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={3} />
    );
    expect(wrapper).to.not.have.descendants("a");
  });

  it("should have props given props", () => {
    const wrapper = mount(
      <TeachingMaterial teachingMaterial={teachingMaterial} number={5} />
    );

    expect(wrapper.props().teachingMaterial).to.eql(teachingMaterial);
    expect(wrapper.props().number).to.eql(5);
  });
});
