import React from "react";
import PropTypes from "prop-types";

import FaIcon from "../fa-icon";

import styles from "./style.scss";

function HelpIcon() {
  return <FaIcon className={styles.helpIcon} icon="question" />;
}

FaIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default HelpIcon;
