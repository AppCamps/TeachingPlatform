import React from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form';
import classNames from 'classnames';

import style from './style.scss';

function RadioInput(props) {
  const { hasError, label, value, name, autoFocus, disabled, className } = props;

  const optionClassNames = classNames({
    [`${style.label}`]: true,
    [`${style.disabled}`]: disabled,
    [`${style.error}`]: hasError,
    [`${className}`]: className,
  });
  const inputProps = { ...props };
  delete inputProps.label;
  delete inputProps.onBlur;
  delete inputProps.onFocus;
  delete inputProps.hasError;

  return (
    /* eslint-disable jsx-a11y/label-has-for */
    <label className={optionClassNames}>
      <input
        {...inputProps}
        type="radio"
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

RadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
};

RadioInput.defaultProps = {
  ...propTypes.input,
  autoFocus: false,
  disabled: false,
  hasError: false,
};

export default RadioInput;
