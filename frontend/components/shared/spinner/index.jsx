import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.scss';

class Spinner extends Component {
  classNames() {
    const { visible } = this.props;
    return classNames({
      [`${style.spinner}`]: true,
      [`${style.spinnerVisible}`]: visible,
    });
  }

  render() {
    return (
      <div className={this.classNames()} />
    );
  }
}

Spinner.propTypes = {
  visible: PropTypes.bool,
};

Spinner.defaultProps = {
  visible: false,
};

export default Spinner;
