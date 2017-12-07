import React from 'react';
import PropTypes from 'prop-types';

export default function IFrame({ src, width, height, allowFullScreen }) {
  return (
    <iframe
      src={src}
      width={`${width}px`}
      height={`${height}px`}
      scrolling="no"
      frameBorder="0"
      allowFullScreen={allowFullScreen}
    />
  );
}

IFrame.defaultProps = {
  allowFullScreen: true,
};

IFrame.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowFullScreen: PropTypes.bool,
};
