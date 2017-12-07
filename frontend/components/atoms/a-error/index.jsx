import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';

function Error(props) {
  return (
    <span className={style.error}>
      {props.children}
    </span>
  );
}

Error.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Error;
