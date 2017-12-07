import React from 'react';
import PropTypes from 'prop-types';

function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="2476.702 2281.591 50 50">
      <g transform="translate(2477.5 2282.5)">
        <line
          stroke={props.color}
          fill="none"
          strokeWidth="1px"
          y2="22.892"
          transform="translate(24.249 12.591)"
        />
        <line
          stroke={props.color}
          fill="none"
          strokeWidth="1px"
          y2="23.094"
          transform="translate(35.796 24.037) rotate(90)"
        />
      </g>
    </svg>
  );
}

PlusIcon.propTypes = {
  color: PropTypes.string,
};

export default PlusIcon;
