import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HmrContainer } from 'react-hot-loader';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import Root from './containers/root';

// global css styles
import './style.scss';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <HmrContainer>
    <Root store={store} history={history} />
  </HmrContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    ReactDOM.render(
      <HmrContainer>
        <Root store={store} history={history} />
      </HmrContainer>,
      document.getElementById('root'),
    );
  });
}
