import { getCountries } from '../services/api';
import { apiFetched } from './api';

export function fetchCountries() {
  return dispatch =>
    getCountries().then((payload) => {
      dispatch(apiFetched(payload));
    });
}
