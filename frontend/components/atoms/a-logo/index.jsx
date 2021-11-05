import React from "react";
import { Link } from "react-router";

/* eslint-disable import/no-webpack-loader-syntax */
import image from "!file-loader?name=[name]-[contenthash].[ext]!./logo.png";
import image2x from "!file-loader?name=[name]-[contenthash].[ext]!./logo@2x.png";
/* eslint-enable import/no-webpack-loader-syntax */

import style from "./style.scss";

function Logo() {
  return (
    <figure className={style.logo}>
      <Link to="/">
        <img
          alt="App Camps Logo"
          src={image}
          srcSet={`${image} 1x, ${image2x} 2x`}
        />
      </Link>
    </figure>
  );
}

export default Logo;
