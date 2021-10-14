import React from "react";
import PropTypes from "prop-types";
import { propTypes } from "redux-form";
import classNames from "classnames";

import style from "./style.scss";

function Input(props) {
  const { hasError, name, type, autoFocus } = props;

  const inputClasseNames = classNames({
    [`${style.input}`]: true,
    [`${style.inputError}`]: hasError,
  });

  const inputProps = { ...props };
  delete inputProps.hasError;

  return (
    <input
      {...inputProps}
      name={name}
      className={inputClasseNames}
      type={type}
      autoFocus={autoFocus}
    />
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  hasError: PropTypes.bool,
};

Input.defaultProps = {
  ...propTypes.input,
  type: "text",
  autoFocus: false,
  hasError: false,
};

export default Input;
