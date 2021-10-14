import React from "react";
import PropTypes from "prop-types";

import style from "../style.scss";
import image from "./button.png";

const FAQ = (props, { t }) => (
  <div className={style.container}>
    <h1>{t("Contact team")}</h1>
    <div className={style.contentContainer}>
      <p className={style.question}>
        Du hast folgende Möglichkeiten mit dem App Camps Team Kontakt
        aufzunehmen:
      </p>
      <ol className={style.list}>
        <li>
          Du nutzt unseren Chat{" "}
          <a className="custom-intercom-launcher" tabIndex="0" role="link">
            <img
              style={{ width: "32px", height: "32px" }}
              src={image}
              alt="Intercom"
            />
          </a>{" "}
          unten rechts. Dort landet deine Nachricht direkt beim Team und wir
          können dir schnell antworten.
        </li>
        <li>
          Du meldest dich per E-Mail bei Philipp Knodel:{" "}
          <a href="mailto:philipp@appcamps.de">philipp@appcamps.de</a>
        </li>
      </ol>
    </div>
  </div>
);

FAQ.propTypes = {};
FAQ.defaultProps = {};
FAQ.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default FAQ;
