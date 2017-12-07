import { push } from 'react-router-redux';

export function selectTopic(slug) {
  return dispatch => dispatch(push(`/topics/${slug}/preparations`));
}
