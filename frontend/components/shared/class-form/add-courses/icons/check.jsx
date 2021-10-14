import React from "react";
import PropTypes from "prop-types";

function CheckIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="4074.157 3803.208 50 50">
      <defs>
        <mask id="cut-check">
          <rect
            fill="white"
            x="4074.157"
            y="3803.208"
            width="100%"
            height="100%"
          />
          <path
            fill="white"
            stroke="black"
            d="M1017.5,3513.131l7.8,7.336,12.474-17.335"
            transform="translate(3072 315.368)"
          />
        </mask>
      </defs>
      <rect
        fill={props.color}
        stroke="none"
        strokeWidth="1px"
        mask="url(#cut-check)"
        x="4074.157"
        y="3803.208"
        width="100%"
        height="100%"
      />
    </svg>
  );
}

CheckIcon.propTypes = {
  color: PropTypes.string,
};

export default CheckIcon;
