import React from "react";
import PropTypes from "prop-types";

/* eslint-disable import/no-webpack-loader-syntax */
import image from "!file-loader?name=[name]-[hash].[ext]!./icon_kursbeendet.png";
import image2x from "!file-loader?name=[name]-[hash].[ext]!./icon_kursbeendet@2x.png";
/* eslint-enable import/no-webpack-loader-syntax */

import style from "./style.scss";

function Trophy({ text }) {
  return (
    <figure className={style.trophy}>
      <img alt="Trophy" src={image} srcSet={`${image} 1x, ${image2x} 2x`} />
      <span>{text}</span>
    </figure>
  );
}

Trophy.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Trophy;
