import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function FaIcon(props) {
  const { icon, className } = props;

  const classes = classNames({
    fa: true,
    [`fa-${icon}`]: true,
    [className]: className,
  });

  return <i className={classes} aria-hidden="true" />;
}

FaIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};

FaIcon.defaultProps = {
  className: null,
};

export default FaIcon;
