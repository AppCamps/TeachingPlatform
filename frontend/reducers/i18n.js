const defaultState = {
  lang: process.env.DEFAULT_LANGUAGE,
};

export default function i18nState(state = defaultState, action) {
  switch (action.type) {
    case "REDUX_I18N_SET_LANGUAGE":
      return {
        ...state,
        lang: action.lang,
      };
    default:
      return state;
  }
}
