import React from "react";
import PropTypes from "prop-types";

import Link from "../../shared/link";
import LocalityForm from "../../shared/locality-form";

import { Shape as UserShape } from "../../../models/user";

import style from "./style.scss";

function EditUserLocality(props, context) {
  const { t } = context;
  const { user } = props;

  let localityString = t("Change address");
  if (user.teacher) {
    localityString = t("Edit school information");
  }

  return (
    <div className={style.container}>
      <div className={style.editUserPassword}>
        <h1 className={style.heading}>{t("Edit your data")}</h1>
        <div className={style.cancel}>
          <Link to="/">{t("cancel")}</Link>
        </div>
        <div className={style.editUserPasswordForm}>
          <h2>{t(localityString)}</h2>
          <LocalityForm {...props} />
        </div>
      </div>
    </div>
  );
}

EditUserLocality.contextTypes = {
  t: PropTypes.func.isRequired,
};

EditUserLocality.propTypes = {
  user: UserShape.isRequired,
};

export default EditUserLocality;
