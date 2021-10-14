import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ErrorBoundary from './error-boundary';
import I18n from './i18n';
import { translations } from '../../translations';
import Routes from '../../routes';

function Root(props) {
  const { store, history } = props;

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18n translations={translations}>
          <Routes history={history} />
        </I18n>
      </Provider>
    </ErrorBoundary>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
