import React from "react";
import PropTypes from "prop-types";

function Check(props) {
  const { color } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2232.818 -1235.338 10.293 9.852"
    >
      <path
        fill="none"
        stroke={color}
        strokeWidth="1px"
        d="M1383,1407.041l3.234,4.506,6.247-8.7"
        transform="translate(-3615.412 -2637.89)"
      />
    </svg>
  );
}

Check.propTypes = {
  color: PropTypes.string,
};

Check.defaultProps = {
  color: "white",
};

export default Check;
