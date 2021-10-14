export const paginationSelector = (identifier) => (state) =>
  state.pagination[identifier] || {};
