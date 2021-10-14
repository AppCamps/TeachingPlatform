import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import orm from './orm';
import i18nState from './i18n';
import authentication from './authentication';
import pagination from './pagination';
import preparations from './preparations';
import notifications from './notifications';
import classes from './classes';
import registration from './registration';

import { APPLICATION_STATE_RESET } from '../constants/application';

const rootReducer = combineReducers({
  routing,
  orm,
  form,
  i18nState,
  authentication,
  pagination,
  preparations,
  notifications,
  classes,
  registration,
});

export default function (state = {}, action) {
  if (action.type === APPLICATION_STATE_RESET) {
    return rootReducer(
      {
        // keep authentication state for session expired error message
        authentication: state.authentication,
        routing: state.routing,
      },
      action,
    );
  }
  return rootReducer(state, action);
}
