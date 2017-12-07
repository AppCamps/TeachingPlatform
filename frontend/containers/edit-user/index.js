import { connect } from 'react-redux';

import { updateUser } from '../../actions/user';
import { emailConfirmationRequest } from '../../actions/email-confirmation';
import EditUserComponent from '../../components/edit-user';
import { userSelector } from '../../selectors/shared/user';

export function mapStateToProps(state) {
  const user = userSelector(state);
  const { email, unconfirmedEmail, firstName, lastName } = user;

  return {
    user,
    initialValues: {
      email: unconfirmedEmail || email,
      firstName,
      lastName,
    },
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateUser: user => dispatch(updateUser(user)),
    emailConfirmationRequest: email => dispatch(emailConfirmationRequest(email)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserComponent);
