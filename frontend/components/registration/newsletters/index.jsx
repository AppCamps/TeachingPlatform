import React from "react";
import PropTypes from "prop-types";

import InputWithLabel from "../../shared/input-with-label";
import Button from "../../shared/button";

import style from "./style.scss";

function StudentNewsletter(props, context) {
  const { t } = context;
  return (
    <div id="mc_embed_signup">
      <h2 className={style.heading}>
        {t("Thank you for you interest in App Camps")}
      </h2>
      <div className={style.info}>{props.children}</div>
    </div>
  );
}

StudentNewsletter.propTypes = {
  children: PropTypes.node,
  hiddenInputName: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  newsletterId: PropTypes.string.isRequired,
};

StudentNewsletter.defaultProps = {
  children: null,
};

StudentNewsletter.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default StudentNewsletter;
