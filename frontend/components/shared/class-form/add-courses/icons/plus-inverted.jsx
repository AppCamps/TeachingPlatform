import React from "react";
import PropTypes from "prop-types";

function PlusInvertedIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="2476.702 2281.591 50 50">
      <defs>
        <mask id="cut-plus">
          <rect
            fill="white"
            x="2476.702"
            y="2281.591"
            width="100%"
            height="100%"
          />
          <g transform="translate(2477.5 2282.5)">
            <line
              stroke="black"
              fill="none"
              strokeWidth="1px"
              y2="22.892"
              transform="translate(24.249 12.591)"
            />
            <line
              stroke="black"
              fill="none"
              strokeWidth="1px"
              y2="23.094"
              transform="translate(35.796 24.037) rotate(90)"
            />
          </g>
        </mask>
      </defs>
      <rect
        fill={props.color}
        mask="url(#cut-plus)"
        x="2476.702"
        y="2281.591"
        width="100%"
        height="100%"
      />
    </svg>
  );
}

PlusInvertedIcon.propTypes = {
  color: PropTypes.string,
};

export default PlusInvertedIcon;
