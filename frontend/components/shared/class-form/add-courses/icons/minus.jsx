import React from 'react';
import PropTypes from 'prop-types';

function MinusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="2476.702 3978.537 50 50">
      <line
        fill="none"
        stroke={props.color}
        strokeWidth="1px"
        y2="23.094"
        transform="translate(2513.296 4003.637) rotate(90)"
      />
    </svg>
  );
}

MinusIcon.propTypes = {
  color: PropTypes.string,
};

export default MinusIcon;
