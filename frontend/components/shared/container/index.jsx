import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./style.scss";

class Container extends Component {
  className() {
    const { transparent, centered } = this.props;
    return classNames({
      [`${style.container}`]: true,
      [`${style.containerTransparend}`]: transparent,
      [`${style.containerCentered}`]: centered,
    });
  }

  render() {
    return <div className={this.className()}>{this.props.children}</div>;
  }
}

Container.propTypes = {
  children: PropTypes.node,
  centered: PropTypes.bool,
  transparent: PropTypes.bool,
};

Container.defaultProps = {
  children: null,
  centered: false,
  transparent: false,
};

export default Container;
