import React from "react";
import PropTypes from "prop-types";
import Link from "../../../shared/link";
import { FeatureToggle } from "../../../../debug";

import FaIcon from "../../../shared/fa-icon";

import style from "./style.scss";

function HeaderActions(props, context) {
  const { t } = context;
  const { user } = props;

  let localityString = t("Change address");
  if (user.teacher) {
    localityString = t("Edit school information");
  }

  return (
    <ul className={style.list}>
      <li className={style.help}>
        <div>
          <span className={style.name}>{t("Help")}</span>
          <FaIcon icon={"angle-down"} />
        </div>
        <ul className={style.dropdown}>
          <li className={style.dropdownItem}>
            <Link to="/help/platform-tips">{t("Platform tips")}</Link>
          </li>
          <li className={style.dropdownItem}>
            <Link to="/help/faq">{t("Frequently asked questions")}</Link>
          </li>
          <li className={style.dropdownItem}>
            <Link to="/help/contact">{t("Contact team")}</Link>
          </li>
          <li className={style.dropdownItem}>
            <Link to="/help/certificates">{t("Certificates")}</Link>
          </li>
        </ul>
      </li>
      <li className={style.user}>
        <Link to="/edit-user">
          <FaIcon icon={"user"} />{" "}
          <span className={style.name}>{user.fullName}</span>
          <FaIcon icon={"angle-down"} />
        </Link>
        <ul className={style.dropdown}>
          <li className={style.dropdownItem}>
            <Link to="/edit-user">{t("Edit user information")}</Link>
          </li>
          <li className={style.dropdownItem}>
            <Link to="/edit-user/locality">{localityString}</Link>
          </li>
          <li className={style.dropdownItem}>
            <Link to="/edit-user/password">{t("Edit password")}</Link>
          </li>
          <li className={`${style.dropdownItem} ${style.logout}`}>
            <Link to="/logout">{t("Logout")}</Link>
          </li>
        </ul>
      </li>
    </ul>
  );
}

HeaderActions.defaultProps = {
  user: {},
};

HeaderActions.propTypes = {
  user: PropTypes.shape({ isAuthenticated: PropTypes.bool }),
};

HeaderActions.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default HeaderActions;
