import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import EmailConfirmationForm from '../../components/email-confirmation';

import { emailConfirmationRequest } from '../../actions/email-confirmation';

export function mapDispatchToProps(dispatch) {
  return {
    emailConfirmationRequest: payload =>
      dispatch(emailConfirmationRequest(payload))
        .then(dispatch(push('/')))
    ,
  };
}

export default connect(() => ({}), mapDispatchToProps)(EmailConfirmationForm);
