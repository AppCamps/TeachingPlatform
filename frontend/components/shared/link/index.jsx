import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';

import FaIcon from '../fa-icon';

import style from './style.scss';

class LinkWrapper extends Component {
  classNames() {
    const { button, isAction, isSecondary, isGreen, className } = this.props;

    return classNames({
      [`${style.button}`]: button,
      [`${style.buttonAction}`]: isAction,
      [`${style.buttonSecondary}`]: isSecondary,
      [`${style.buttonGreen}`]: isGreen,
      [`${className}`]: className,
    });
  }

  icon(position) {
    const iconName = `${position}Icon`;
    const icon = this.props[iconName];

    if (icon) {
      const classes = classNames({
        [`${style[iconName]}`]: true,
        [`${style.large}`]: icon.startsWith('angle-'),
      });

      return (
        <span className={classes}>
          <FaIcon icon={icon} />
        </span>
      );
    }
    return null;
  }

  render() {
    const linkProps = Object.assign({}, this.props);

    delete linkProps.button;
    delete linkProps.isAction;
    delete linkProps.isSecondary;
    delete linkProps.isGreen;
    delete linkProps.className;
    delete linkProps.leftIcon;
    delete linkProps.rightIcon;
    delete linkProps.children;

    let LinkComponent;
    if (this.props.href) {
      LinkComponent = 'a';
    } else {
      LinkComponent = Link;
    }

    /* eslint-disable jsx-a11y/anchor-has-content */
    return (
      <LinkComponent className={this.classNames()} {...linkProps}>
        {this.icon('left')}
        {this.props.children}
        {this.icon('right')}
      </LinkComponent>
    );
    /* eslint-enable jsx-a11y/anchor-has-content */
  }
}

LinkWrapper.propTypes = {
  button: PropTypes.bool,
  isAction: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isGreen: PropTypes.bool,
  className: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  /* eslint-enable react/no-unused-prop-types */
};

LinkWrapper.defaultProps = {
  button: false,
  isAction: false,
  isSecondary: false,
  isGreen: false,
  className: null,
  leftIcon: null,
  rightIcon: null,
  href: null,
};

export default LinkWrapper;
