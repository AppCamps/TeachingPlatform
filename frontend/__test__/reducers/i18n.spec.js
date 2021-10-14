import { expect } from "../chai_helper";

import i18nReducer from "../../reducers/i18n";

describe("user userReducer", () => {
  it("return initial state", () => {
    expect(i18nReducer(undefined, {})).to.deep.equal({
      lang: process.env.DEFAULT_LANGUAGE,
    });
  });

  it("should set language on REDUX_I18N_SET_LANGUAGE", () => {
    const testState = { lang: process.env.DEFAULT_LANGUAGE };
    expect(
      i18nReducer(testState, {
        type: "REDUX_I18N_SET_LANGUAGE",
        lang: process.env.DEFAULT_LANGUAGE,
      })
    ).to.deep.equal({ lang: process.env.DEFAULT_LANGUAGE });
  });
});
