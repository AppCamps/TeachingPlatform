import React from "react";
import PropTypes from "prop-types";

import Header from "./header";
import Notifications from "../../containers/app/notifications";
import Footer from "./footer";

import style from "./style.scss";

function Layout(props) {
  const { user } = props;

  return (
    <div>
      <Header user={user} />
      <Notifications />
      <section className={style.container}>{props.children}</section>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  user: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
  }),
  children: PropTypes.element.isRequired,
};

Layout.defaultProps = {
  user: { isAuthenticated: false },
};

export default Layout;
