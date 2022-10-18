/* eslint-disable */
import cssColors from "./components/__css__/exported-styles.scss";

const t = (t) => t;

class Config {
  static get colors() {
    return cssColors;
  }

  static get constants() {
    return Object.freeze({
      WWW_URL: process.env.WWW_URL,
      SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
      DEFAULT_LANG: "de",
      PRIMARY_COUNTRIES: ["DEU", "AUT", "CHE"],
      STUDENT_COUNT_MAX: 999,
    });
  }

  static get schoolTypes() {
    return {
      school_type_elementary_school: t("Elementary school"),
      school_type_main_school: t("Main school"),
      school_type_middle_school: t("Middle school"),
      school_type_comprehensive_school: t("Comprehensive school"),
      school_type_academic_high_school: t("Academic high school"),
      school_type_vocational_school: t("Vocational school"),
      school_type_university: t("University"),
      school_type_special_school: t("Special school"),
    };
  }

  static get notifications() {
    return {
      success: "success",
      failure: "failure",
    };
  }
}

export const colors = Config.colors;
export const constants = Config.constants;
export const schoolTypes = Config.schoolTypes;
export const translatedFormError = Config.translatedFormError;
export const notifications = Config.notifications;
