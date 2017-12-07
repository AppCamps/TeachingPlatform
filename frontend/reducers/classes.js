import { SHOW_ALL, SHOW_TOP, TOGGLE_CLASS } from '../constants/classes';

export const initialState = {
  showAll: false,
  openedClassIds: [],
};

function toggleClassId(openedClassIds, id) {
  if (Array.includes(openedClassIds, id)) {
    return openedClassIds.filter(klassId => klassId !== id);
  }
  return openedClassIds.concat(id);
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALL:
      return {
        ...state,
        showAll: true,
      };
    case SHOW_TOP:
      return {
        ...state,
        showAll: false,
      };
    case TOGGLE_CLASS:
      return {
        ...state,
        openedClassIds: toggleClassId(state.openedClassIds, action.id),
      };
    default:
      return state;
  }
};
