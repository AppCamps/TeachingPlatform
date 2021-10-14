import { connect } from "react-redux";

import Dashboard from "../../components/dashboard";
import { unreadPostsPresentSelector } from "../../selectors/posts";

export function mapStateToProps(state, ownProps) {
  return {
    unreadPostsPresent: unreadPostsPresentSelector(state),
    router: ownProps.location,
  };
}

export default connect(mapStateToProps)(Dashboard);
