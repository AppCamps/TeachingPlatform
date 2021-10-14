import React from "react";
import PropTypes from "prop-types";

import { translatedFormError } from "../../../utils/translations";

import style from "./style.scss";

function Label(props) {
  const { required, text, children } = props;
  const htmlFor = props.for;

  return (
    <label htmlFor={htmlFor} className={style.label}>
      {text || children}
      {required ? " " : null}
      {required ? <abbr title={translatedFormError("required")}>*</abbr> : null}
    </label>
  );
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
  for: PropTypes.string,
  children: PropTypes.element,
  required: PropTypes.bool,
};

Label.defaultProps = {
  children: null,
  required: false,
  for: null,
};

export default Label;
