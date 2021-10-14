import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import style from "./style.scss";

function Notifications(props) {
  const { activeNotifications } = props;

  const notifications = activeNotifications.map(({ key, type, text }) => {
    const classes = classNames({
      [`${style.notification}`]: true,
      [`${style[type]}`]: type,
    });

    return (
      <div key={key} className={classes}>
        {text}
      </div>
    );
  });

  return (
    <div className={style.notificationsContainer}>
      <div className={style.notifications}>
        <div className={style.absolution}>{notifications}</div>
      </div>
    </div>
  );
}

Notifications.propTypes = {
  activeNotifications: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["success", "failure"]),
      text: PropTypes.string,
    })
  ),
};

Notifications.defaultProps = {
  activeNotifications: [],
};

export default Notifications;
