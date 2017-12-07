import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';
import 'string.prototype.startswith';

import style from './style.scss';

class Dashboard extends Component {
  navLinks(currentPath) {
    const { t } = this.context;
    const componentDefinitions = [
      { text: t('My classes'), path: '/classes' },
      { text: t('Teaching material'), path: '/topics' },
      { text: t('News'), path: '/posts' },
    ];
    return componentDefinitions.map(({ text, path }) => {
      const isActive = currentPath.startsWith(path);
      const classes = classNames({
        [`${style.item}`]: true,
        [`${style.itemIsActive}`]: isActive,
      });
      let activityIndicator = null;
      if (path === '/posts' && this.props.unreadPostsPresent) {
        activityIndicator = <span className={style.activityIndicator} />;
      }

      return (
        <li key={path} className={classes}>
          <Link to={path}>
            {activityIndicator}
            {text}
          </Link>
        </li>
      );
    });
  }

  render() {
    const { location: { pathname }, children } = this.props;

    return (
      <div>
        <nav className={style.navigation}>
          <ul className={style.list}>{this.navLinks(pathname)}</ul>
        </nav>
        {children}
      </div>
    );
  }
}

Dashboard.contextTypes = {
  t: PropTypes.func.isRequired,
};

Dashboard.propTypes = {
  unreadPostsPresent: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

Dashboard.defaultProps = {
  children: null,
  unreadPostsPresent: false,
};

export default Dashboard;
