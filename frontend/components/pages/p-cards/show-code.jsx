import React from "react";
import PropTypes from "prop-types";
import { parseInternalCardLink } from "../../../utils";
import Container from "../../shared/container";

import style from "./style.scss";

export default function CardsPage({ encoded }, { t }) {
  const decoded = atob(encoded);
  const { url, code } = parseInternalCardLink(decoded);

  return (
    <div className={style.formContainer}>
      <Container>
        <p className={style.showCodeText}>
          {t("Here you go to the learning cards")}
        </p>
        <p className={style.showCodeLink}>
          <span>1. {t("Open the URL in the browser")}: </span>
          <b>{url}</b>
        </p>
        <p className={style.showCodeLink}>
          <span>2. {t("Submit this code")}: </span>
          <b>{code}</b>
        </p>
      </Container>
    </div>
  );
}

CardsPage.contextTypes = {
  t: PropTypes.func.isRequired,
};

CardsPage.propTypes = {
  encoded: PropTypes.string.isRequired,
};
