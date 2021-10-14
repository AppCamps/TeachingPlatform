import React, { Component } from "react";
import PropTypes from "prop-types";
import { propTypes } from "redux-form";

import Radio from "../../shared/radio";
import Label from "../label";
import Error from "../../atoms/a-error";

class RadioWithLabel extends Component {
  radioButtons() {
    const { options, input, disabled, autoFocus, optionClassName, meta } =
      this.props;
    const name = this.props.name || input.name;
    const hasError = meta && meta.error && meta.touched;

    let focused = autoFocus;
    return options.map(({ value, label, className }) => {
      const inputProps = { ...input };
      if (focused) {
        inputProps.autoFocus = true;
        focused = false;
      }

      const checked = value === input.value;
      return (
        <Radio
          key={label}
          {...inputProps}
          className={className || optionClassName}
          name={name}
          disabled={disabled}
          value={value}
          label={label}
          checked={checked}
          hasError={hasError}
        />
      );
    });
  }

  render() {
    const { t } = this.context;
    const { label, meta, required, className } = this.props;
    const name = this.props.name || this.props.input.name;
    const touched = meta && meta.touched;
    const error = meta && meta.error;

    return (
      <div>
        <div className={className}>
          <Label text={label} required={required} />
          {touched && error && <Error for={name}>{t(error)}</Error>}
        </div>
        {this.radioButtons()}
      </div>
    );
  }
}

RadioWithLabel.propTypes = {
  ...propTypes.input,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  optionClassName: PropTypes.string,
};

RadioWithLabel.defaultProps = {
  required: false,
};

RadioWithLabel.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default RadioWithLabel;
