import { connect } from "react-redux";

import { activeNotificationsSelector } from "../../selectors/notifications";

import Notifications from "../../components/app/notifications";

export function mapStateToProps(state) {
  return {
    activeNotifications: activeNotificationsSelector(state),
  };
}

export default connect(mapStateToProps)(Notifications);
