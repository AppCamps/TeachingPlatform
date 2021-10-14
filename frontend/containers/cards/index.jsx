import { connect } from "react-redux";

import CardsPage from "../../components/pages/p-cards";

function mapStateToProps(_, { params: { code } }) {
  return {
    code,
  };
}

export default connect(mapStateToProps)(CardsPage);
