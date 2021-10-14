import "url-search-params-polyfill";

import { API_FETCHED } from "../constants/api";

export function apiFetched(payload) {
  return {
    type: API_FETCHED,
    payload,
  };
}
