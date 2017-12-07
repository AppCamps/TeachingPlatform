import React from 'react';
import PropTypes from 'prop-types';

import { isAuthenticated } from '../../../services/auth';

import Logo from '../../atoms/a-logo';
import HeaderActions from './actions';

import style from './style.scss';

function Header(props) {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <div className={style.logo}>
          <Logo />
        </div>
        <div className={style.actions}>
          {isAuthenticated(props.user) ? <HeaderActions {...props} /> : null}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({ isAuthenticated: PropTypes.bool }),
};

Header.defaultProps = {
  user: null,
};

export default Header;
