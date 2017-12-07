import React from 'react';
import PropTypes from 'prop-types';
import ResizingTextArea from 'react-textarea-autosize';

import style from './style.scss';

function TextArea(props) {
  const TextAreaComponent = (props.resize) ? ResizingTextArea : 'textarea';

  const { rows, disabled, placeholder } = props;

  return (
    <TextAreaComponent
      className={style.textarea}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

TextArea.propTypes = {
  resize: PropTypes.bool,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

TextArea.defaultProps = {
  resize: true,
  disabled: false,
  placeholder: null,
  rows: 3,
};

export default TextArea;
