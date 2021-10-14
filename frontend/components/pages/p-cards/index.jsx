import React from "react";
import PropTypes from "prop-types";

import Slides from "../../molecules/m-slides";

export default function CardsPage({ code }) {
  return <Slides deck={code} />;
}

CardsPage.contextTypes = {
  t: PropTypes.func.isRequired,
};

CardsPage.propTypes = {
  code: PropTypes.string.isRequired,
};
