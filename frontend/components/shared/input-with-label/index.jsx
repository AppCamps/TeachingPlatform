import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form';
import classNames from 'classnames';

import Input from '../../shared/input';
import Label from '../label';
import Error from '../../atoms/a-error';

import style from './style.scss';

function InputWithLabel(props, context) {
  const { t } = context;
  const {
    input,
    type,
    label,
    meta,
    disabled,
    placeholder,
    autoFocus,
    required,
    className,
    min,
    max,
  } = props;
  const name = props.name || input.name;
  let touched = false;
  if (type === 'password') {
    touched = meta && ((meta.active && input.value) || meta.touched);
  } else {
    touched = meta && meta.touched;
  }
  const error = meta && meta.error;
  const showError = !!(error && touched);

  const cssClasses = classNames({
    [`${style.inputWithLabel}`]: true,
    [`${className}`]: className,
  });

  return (
    <div className={cssClasses}>
      <Label for={name} text={label} required={required} />
      {showError && <Error for={name}>{t(error)}</Error>}
      <Input
        {...input}
        name={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus={autoFocus}
        hasError={showError}
        min={min}
        max={max}
      />
    </div>
  );
}

InputWithLabel.propTypes = {
  ...propTypes.input,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
};

InputWithLabel.defaultProps = {
  required: false,
  className: null,
  autoFocus: false,
  min: null,
  max: null,
  disabled: null,
  placeholder: null,
};

InputWithLabel.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default InputWithLabel;
