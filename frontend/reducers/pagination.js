import { PAGINATION_FETCHED } from "../constants/pagination";

const paginationReducer = (state = {}, action) => {
  switch (action.type) {
    case PAGINATION_FETCHED:
      return {
        ...state,
        [action.identifier]: action.payload || {},
      };
    default:
      return state;
  }
};

export default paginationReducer;
