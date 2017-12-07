import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { propTypes } from 'redux-form';

import TextArea from '../textarea';
import Label from '../label';
import Error from '../../atoms/a-error';

import style from './style.scss';

function TextAreaWithLabel(props, context) {
  const { t } = context;
  const { input, label, meta, disabled, placeholder, className } = props;
  const name = props.name || input.name;
  const touched = meta && meta.touched;
  const error = meta && meta.error;

  const containerClassNames = classNames({
    [`${style.textareaWithLabel}`]: true,
    [`${className}`]: className,
  });

  return (
    <div className={containerClassNames}>
      <Label for={name} text={label} />
      {touched && error && <Error for={name}>{t(error)}</Error>}
      <TextArea
        {...input}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}

TextAreaWithLabel.propTypes = {
  ...propTypes.input,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

TextAreaWithLabel.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default TextAreaWithLabel;
