import { connect } from 'react-redux';

import ShowCodePage from '../../components/pages/p-cards/show-code';

function mapStateToProps(_, { params: { encoded } }) {
  return {
    encoded,
  };
}

export default connect(mapStateToProps)(ShowCodePage);
