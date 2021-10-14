import React from "react";
import PropTypes from "prop-types";
import { propTypes } from "redux-form";
import classNames from "classnames";

import style from "./style.scss";

function Checkbox(props) {
  const { label, value, name, autoFocus, disabled, className, hasError } =
    props;

  const optionClassNames = classNames({
    [`${style.label}`]: true,
    [`${style.disabled}`]: disabled,
    [`${style.error}`]: hasError,
    [`${className}`]: className,
  });

  const inputProps = { ...props };
  delete inputProps.label;
  delete inputProps.hasError;

  return (
    /* eslint-disable jsx-a11y/label-has-for */
    <label className={optionClassNames}>
      <input
        {...inputProps}
        type="checkbox"
        className={style.input}
        autoFocus={autoFocus}
        name={name}
        value={value}
      />
      <span />
      {label}
    </label>
    /* eslint-enable jsx-a11y/label-has-for */
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
};

Checkbox.defaultProps = {
  ...propTypes.input,
  autoFocus: false,
  disabled: false,
  value: true,
  hasError: false,
};

export default Checkbox;
