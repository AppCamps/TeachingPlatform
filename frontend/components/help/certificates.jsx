import React from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";

import style from "./style.scss";

const PlatformTips = (_props, { t }) => (
  <div className={style.container}>
    <h1>{t("Information about certificates")}</h1>
    <div className={style.contentContainer}>
      <p className={style.question}>{t("How can I download certificates?")}</p>
      <div>
        <p>
          {t(
            "In this video you will learn how and where you can dowload the certificates for your pupils"
          )}{" "}
          <span className={style.mediaInfo}>(1:15)</span>:
        </p>
        <div className={style.videoContainer}>
          <ReactPlayer
            url="https://player.vimeo.com/video/505620014?h=f40cc2d925"
            width="100%"
            height="534px"
          />
        </div>
      </div>
    </div>
  </div>
);

PlatformTips.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default PlatformTips;
