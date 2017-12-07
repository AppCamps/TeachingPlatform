import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers';
import { rootSaga } from '../sagas';
import { initializeApi } from '../services/api';
import { intializeTranslationUtils } from '../utils/translations';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(browserHistory),
      sagaMiddleware,
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

intializeTranslationUtils(store);
initializeApi(store);
sagaMiddleware.run(rootSaga);

if (module.hot) {
  module.hot.accept('../reducers', () => {
    // eslint-disable-next-line global-require
    const nextReducer = require('../reducers');

    store.replaceReducer(nextReducer);
  });
}

export default store;
