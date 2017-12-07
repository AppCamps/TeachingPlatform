import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

export function mapStateToProps(state, { params: { topicSlug } }) {
  return {
    topicSlug,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    redirect: topicSlug => dispatch(replace(`/topics/${topicSlug}/preparations`)),
  };
}

export class RedirectComponent extends Component {
  componentWillMount() {
    const { topicSlug, redirect } = this.props;
    redirect(topicSlug);
  }

  render() {
    return <div />;
  }
}

RedirectComponent.propTypes = {
  topicSlug: PropTypes.string.isRequired,
  redirect: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(RedirectComponent);
