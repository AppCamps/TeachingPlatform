import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.scss';

function Number(props) {
  const { number, color, invert } = props;

  let colorStyles;
  if (color && invert) {
    colorStyles = {
      backgroundColor: color,
      borderColor: color,
    };
  } else if (color) {
    colorStyles = {
      color,
      borderColor: color,
    };
  }

  const classes = classNames({
    [`${style.number}`]: true,
    [`${style.numberInverted}`]: invert,
  });

  return (
    <span className={classes} style={colorStyles}>
      {number}
    </span>
  );
}

Number.propTypes = {
  number: PropTypes.number.isRequired,
  color: PropTypes.string,
  invert: PropTypes.bool,
};

Number.defaultProps = {
  invert: false,
};

export default Number;
