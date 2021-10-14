import React from "react";
import PropTypes from "prop-types";
import { propTypes } from "redux-form";

import Checkbox from "../../shared/checkbox";
import Label from "../label";
import Error from "../../atoms/a-error";

function CheckboxWithLabel(props, context) {
  const { t } = context;
  const {
    label,
    meta,
    required,
    className,
    checkboxClassName,
    input,
    autoFocus,
    disabled,
    value,
    checkboxLabel,
  } = props;
  const name = props.name || input.name;
  const touched = meta && meta.touched;
  const error = meta && meta.error;

  return (
    <div>
      <div className={className}>
        <Label text={label} required={required} />
        {touched && error && <Error for={name}>{t(error)}</Error>}
      </div>
      <Checkbox
        {...{
          ...input,
          autoFocus,
          disabled,
          name,
          value,
          checked: input.value,
        }}
        label={checkboxLabel}
        className={checkboxClassName}
        hasError={error && touched}
      />
    </div>
  );
}

CheckboxWithLabel.propTypes = {
  ...propTypes.input,
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  checkboxClassName: PropTypes.string,
  checkboxLabel: PropTypes.node,
};

CheckboxWithLabel.defaultProps = {
  required: false,
  className: null,
  autoFocus: false,
  checkboxClassName: null,
  checkboxLabel: null,
};

CheckboxWithLabel.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CheckboxWithLabel;
