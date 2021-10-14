import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
} from "../constants/notifications";

const notificationReducer = (state = { active: [] }, action) => {
  switch (action.type) {
    case NOTIFICATION_SHOW:
      return {
        ...state,
        active: [...state.active, action.payload],
      };
    case NOTIFICATION_HIDE:
      return {
        ...state,
        active: state.active.filter((n) => n !== action.payload),
      };
    default:
      return state;
  }
};

export default notificationReducer;
