import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';

function Help(props) {
  return <div className={style.help}>{props.children}</div>;
}

Help.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Help;
