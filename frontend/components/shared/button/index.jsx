import React, { Component } from "react";
import PropTypes from "prop-types";
import stylePropTypes from "react-style-proptype";
import classNames from "classnames";

import style from "./style.scss";

import FaIcon from "../fa-icon";

class Button extends Component {
  classNames() {
    const { isAction, isSecondary, isGreen, isFullWidth, onClick, className } =
      this.props;
    return classNames({
      [`${style.button}`]: true,
      [`${style.buttonAction}`]: isAction,
      [`${style.buttonSecondary}`]: isSecondary,
      [`${style.buttonGreen}`]: isGreen,
      [`${style.buttonClickable}`]: onClick,
      [`${style.buttonFullWidth}`]: isFullWidth,
      [`${className}`]: className,
    });
  }

  icon(position) {
    const iconName = `${position}Icon`;
    const icon = this.props[iconName];

    if (icon) {
      const classes = classNames({
        [`${style[iconName]}`]: true,
        [`${style.large}`]: icon.startsWith("angle-"),
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
    const { children, onClick, type, disabled } = this.props;
    const cssStyles = this.props.style;

    return (
      <button
        type={type}
        className={this.classNames()}
        style={cssStyles}
        disabled={disabled}
        onClick={onClick}
      >
        {this.icon("left")}
        {children}
        {this.icon("right")}
      </button>
    );
  }
}

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isAction: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isGreen: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  style: stylePropTypes,
  /* eslint-disable react/no-unused-prop-types */
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  /* eslint-enable react/no-unused-prop-types */
};

Button.defaultProps = {
  type: "button",
  isAction: false,
  isSecondary: false,
  isGreen: false,
  isFullWidth: false,
  disabled: false,
  style: {},
  className: null,
  onClick: () => {},
  leftIcon: null,
  rightIcon: null,
};

export default Button;
