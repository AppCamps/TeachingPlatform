import { push } from 'react-router-redux';

import { getCourses } from '../services/api';
import { apiFetched } from './api';

export function fetchCourses() {
  return dispatch =>
    getCourses().then((payload) => {
      dispatch(apiFetched(payload));
      return payload;
    });
}

export function selectTopic(id) {
  return dispatch => dispatch(push(`/topics/${id}`));
}
