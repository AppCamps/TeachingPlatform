import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { propTypes } from 'redux-form';
import Select from '../select';
import Label from '../label';
import Error from '../../atoms/a-error';

import style from './style.scss';

function getValue(value) {
  return (value && typeof value === 'object') ? value.value : value;
}

class SelectWithLabel extends Component {
  static displayName = 'SelectWithLabel'

  render() {
    const { t } = this.context;
    const { className, input, label, meta, disabled, selectProps, required } = this.props;
    const name = this.props.name || input.name;
    const error = meta && meta.error;
    const hasError = meta && meta.error && meta.touched;

    return (
      <div className={classNames(className, style.select)}>
        <Label for={name} text={label} required={required} />
        {hasError && <Error for={name}>{t(error)}</Error>}
        <Select
          simpleValue
          {...input}
          disabled={disabled}
          onChange={value => input.onChange(getValue(value))}
          onBlur={() => { input.onBlur(); }}
          value={input.value}
          hasError={hasError}
          {...selectProps}
        />
      </div>
    );
  }
}

SelectWithLabel.propTypes = {
  ...propTypes.input,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  selectProps: PropTypes.object,
};

SelectWithLabel.defaultProps = {
  className: '',
  selectProps: {},
};

SelectWithLabel.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SelectWithLabel;
