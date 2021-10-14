import { connect } from "react-redux";
import { push } from "react-router-redux";

import InputCardCodePage from "../../components/pages/p-cards/input-code";

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setCode: (code) => dispatch(push(`/karten/${code}`)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InputCardCodePage);
