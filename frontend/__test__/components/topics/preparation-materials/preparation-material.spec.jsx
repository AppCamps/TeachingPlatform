import React from "react";

import { mount, shallow } from "enzyme";
import { expect } from "../../../chai_helper";
import factory from "../../../__factories__";

import PreparationMaterial, {
  style,
} from "../../../../components/topics/preparation-materials/preparation-material";

describe("<PreparationMaterial />", () => {
  const topic = factory.build("topic");
  const preparationMaterial = factory.build("preparationMaterial", { topic });

  it("wraps everything into a link", () => {
    const wrapper = shallow(
      <PreparationMaterial preparationMaterial={preparationMaterial} />
    );

    expect(wrapper.prop("href")).to.eql(preparationMaterial.link);
  });

  it("renders title, subtitle, description, icon", () => {
    const wrapper = mount(
      <PreparationMaterial preparationMaterial={preparationMaterial} />
    );

    const prepMaterialTitleElement = wrapper.find(
      `.${style.preparationMaterialTitle}`
    );
    const prepMaterialSubtitleElement = wrapper.find(
      `.${style.preparationMaterialSubtitle}`
    );
    const prepMaterialDescriptionElement = wrapper.find(
      `.${style.preparationMaterialDescription}`
    );

    expect(prepMaterialTitleElement).to.exist.and.to.have.text(
      preparationMaterial.title
    );
    expect(prepMaterialSubtitleElement).to.exist.and.to.have.text(
      preparationMaterial.subtitle
    );
    expect(prepMaterialDescriptionElement).to.exist.and.to.have.text(
      preparationMaterial.description
    );
  });
});
