import React from "react";

import { mount, shallow } from "enzyme";
import { expect } from "../../../chai_helper";
import factory from "../../../__factories__";

import Title from "../../../../components/shared/title";
import Spinner from "../../../../components/shared/spinner";

import Preparations from "../../../../components/topics/preparation-materials";
import PreparationMaterial from "../../../../components/topics/preparation-materials/preparation-material";

describe("<Preparations />", () => {
  const topicHtml = factory.build(
    "topic",
    { title: "HTML & CSS" },
    { preparationMaterialsCount: 0 }
  );
  const defaultProps = {};

  it("renders a message for non-existant preparationMaterials", () => {
    const wrapper = shallow(<Preparations {...defaultProps} />, {
      context: {
        t: (translationString) => translationString,
      },
    });

    expect(wrapper.find("div > div")).to.have.text(
      "There are no preparation materials for this topic."
    );
  });

  it("renders preparationMaterials for selectedTopic", () => {
    const preparationMaterial = factory.build("preparationMaterial", {
      topic: topicHtml,
    });
    const wrapper = mount(
      <Preparations
        {...{ ...defaultProps, preparationMaterials: [preparationMaterial] }}
      />,
      { context: { t: (translationString) => translationString } }
    );

    expect(wrapper).to.contain(
      <PreparationMaterial preparationMaterial={preparationMaterial} />
    );
  });
});
