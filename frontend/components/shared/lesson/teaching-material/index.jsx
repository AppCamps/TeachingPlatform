import React, { Component } from "react";
import PropTypes from "prop-types";

import { Shape as TeachingMaterialShape } from "../../../../models/teaching-material";

import { isInternalCardLink } from "../../../../utils";
import Number from "../../../shared/number";

import style from "./style.scss";

class TeachingMaterial extends Component {
  static TARGET_ID = "appcamps-presentation";

  linkWrapper(children) {
    const { teachingMaterial } = this.props;

    if (teachingMaterial.isVideo) {
      return (
        <div>
          <a href={teachingMaterial.link} target={TeachingMaterial.TARGET_ID}>
            {children}
          </a>
        </div>
      );
    } else if (
      teachingMaterial.link &&
      isInternalCardLink(teachingMaterial.link)
    ) {
      return (
        <div>
          <a
            href={`/karten-code/${btoa(teachingMaterial.link)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        </div>
      );
    }

    return <div>{children}</div>;
  }

  render() {
    const { teachingMaterial, number } = this.props;

    return this.linkWrapper(
      <div>
        <div>
          <Number number={number} />
          <span className={style.title}>{teachingMaterial.title}</span>
          <span className={style.subtitle}>{teachingMaterial.subtitle}</span>
        </div>
        <img
          className={style.previewImage}
          src={teachingMaterial.image}
          alt={teachingMaterial.title}
        />
      </div>
    );
  }
}

TeachingMaterial.propTypes = {
  teachingMaterial: TeachingMaterialShape,
  number: PropTypes.number,
};

export default TeachingMaterial;
