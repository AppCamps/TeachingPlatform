import 'url-search-params-polyfill';
import reduce from 'lodash.reduce';

import { PAGINATION_FETCHED } from '../constants/pagination';

function extractPageParam(url, key) {
  const params = new URLSearchParams(url.replace(/.*\?/, ''));
  return params.get(`page[${key}]`);
}

export function paginationFetched(identifier, links) {
  const action = {
    type: PAGINATION_FETCHED,
    identifier,
  };

  if (Object.keys(links).length > 0) {
    const pageNumbers = reduce(
      links,
      (memo, url, key) => {
        memo[key] = parseInt(extractPageParam(url, 'number'), 10);
        return memo;
      },
      {},
    );

    action.payload = {
      ...pageNumbers,
      size: parseInt(extractPageParam(links.self, 'size'), 10),
      current: parseInt(extractPageParam(links.self, 'number'), 10),
    };
  } else {
    action.payload = {};
  }

  return action;
}
