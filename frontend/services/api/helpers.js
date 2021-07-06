import 'es6-promise/auto';

import axios from 'axios';

import { SubmissionError } from 'redux-form';

import { log, trackError } from '../../debug';
import { t } from '../../utils/translations';
import { notifications } from '../../config';

import { requestNotification } from '../../actions/notifications';

import { normalize as normalizeFn, normalizeError as normalizeErrorFn } from './normalize';

axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

let dispatch = null;
export function initializeApi(store) {
  dispatch = store.dispatch;
}

function prependLog(url, method, type) {
  return `${method} ${url}: [${type}]`;
}

function logResponse(response) {
  const { headers, config } = response;
  const { url, method } = config;

  if (!headers) {
    return;
  }

  const requestId = headers['X-Request-Id'] || headers['x-request-id'];
  log(
    `${prependLog(
      url,
      method.toUpperCase(),
      'Response',
    )} Statuscode ${response.status} (Request ID: ${requestId})`,
  );
}

function handleSuccess(result) {
  logResponse(result);
  return Promise.resolve(result.data);
}

function handleError(result) {
  const { response } = result;
  if (response && response.status && response.status < 500) {
    logResponse(response);
    if (response.status === 429) {
      dispatch(
        requestNotification({
          type: notifications.failure,
          text: t('Too many requests. Please try again in a few seconds.'),
        }),
      );
    }
    return Promise.reject(response.data);
  }
  trackError(result);
  dispatch(
    requestNotification({
      type: notifications.failure,
      text: t(
        'There was an Error processing your request. Please contact philipp@appcamps.de if the problem persists.',
      ),
    }),
  );
  throw Error(result);
}

export function fetch(endpoint, description) {
  if (!dispatch) {
    throw new Error('Api service has not been initialized with store');
  }

  description.url = endpoint;
  description.headers = {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    ...(description.headers || {}),
  };
  // send {} as data otherwise axios omits the Content-Type header
  if (!description.data) {
    description.data = {};
  }

  log(`${prependLog(endpoint, description.method, 'Request')}`);

  return axios
    .request(description)
    .then(handleSuccess)
    .catch(handleError);
}

export function normalize(customNormalizeFunction) {
  return (result) => {
    if (customNormalizeFunction) {
      return customNormalizeFunction(result);
    }
    return normalizeFn(result);
  };
}

export function normalizeErrors(customNormalizeErrorFn, throwSubmissionError = false) {
  return (response) => {
    if (customNormalizeErrorFn) {
      return Promise.reject(customNormalizeErrorFn(response));
    }
    const errors = normalizeErrorFn(response);
    if (throwSubmissionError) {
      throw new SubmissionError(errors);
    }
    return Promise.reject(errors);
  };
}
