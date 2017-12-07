import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Logout extends Component {
  static propTypes = {
    logoutUser: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.logoutUser();
  }

  render() { return <div />; }
}

export default Logout;
