import constants from '../constants/preparations';

const initialState = {
  selectedTopicId: null,
};

const preparationsReducer = (state, action) => {
  if (!state) {
    return initialState;
  }

  switch (action.type) {
    case constants.PREPARATIONS_SELECT_TOPIC_ID: {
      return { ...state, selectedTopicId: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default preparationsReducer;
export { initialState };
