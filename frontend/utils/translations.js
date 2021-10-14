import { translations } from "../translations";

let getState = null;
export function intializeTranslationUtils(store) {
  getState = store.getState;
}

export function t(templateKey, interpolationObject) {
  const { lang } = getState ? getState().i18nState : "de";

  let templateString = templateKey;
  if (translations[lang] && translations[lang][templateKey]) {
    templateString = translations[lang][templateKey];
  }

  const matches = templateString.match(/{([A-z0-9]*)}/g);
  if (!matches || matches.length === 0) {
    return templateString;
  }

  return matches.reduce((memo, match) => {
    const key = match.replace(/[{}]/g, "");
    const replaceString = interpolationObject[key];

    if (!replaceString) {
      throw new Error(
        `Could not translate '${templateString}' missing replacement for ${key}.`
      );
    }

    return memo.replace(new RegExp(match), replaceString);
  }, templateString);
}

function formErrors() {
  return {
    required: t("Required"),
    invalid: t("Invalid"),
    notAnEmail: t("Not an email"),
    notEqual: t("Not equal"),
    privacyPolicyNotAccepted: t("You need to confirm our privacy policy"),
    minimumCharCount: t("At least 8 chars"),
    alreadyExists: t("has already been taken"),
  };
}

export function translatedFormError(key, interpolationObject) {
  const translationTemplateString = formErrors()[key];
  if (!translationTemplateString) {
    throw new Error(`Translation for ${key} not found.`);
  }

  return t(translationTemplateString, interpolationObject);
}
