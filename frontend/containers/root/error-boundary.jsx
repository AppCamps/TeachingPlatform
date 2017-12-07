import { Component } from 'react';
import PropTypes from 'prop-types';
import { trackError, log } from '../../debug';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    log(info);
    trackError(error);
    this.setState({ hasError: true });
  }

  render() {
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
