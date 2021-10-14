import React from "react";

import { Shape as PreparationMaterialShape } from "../../../../models/preparation-material";
import FaIcon from "../../../shared/fa-icon";

import style from "./style.scss";

const PreparationMaterial = (props) => {
  const {
    icon,
    title,
    subtitle,
    description,
    link,
    topic: { color },
  } = props.preparationMaterial;

  const mediaBoxStyle = {
    backgroundColor: color,
  };

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className={style.preparationMaterial}>
        <div className={style.preparationMaterialPreview} style={mediaBoxStyle}>
          <FaIcon icon={icon} />
        </div>
        <div className={style.preparationMaterialInfoBox}>
          <h3 className={style.preparationMaterialTitle}>{title}</h3>
          <span className={style.preparationMaterialSubtitle}>{subtitle}</span>
          <div className={style.preparationMaterialDescription}>
            {description}
          </div>
        </div>
      </div>
    </a>
  );
};

PreparationMaterial.propTypes = {
  preparationMaterial: PreparationMaterialShape.isRequired,
};

export { style };
export default PreparationMaterial;
