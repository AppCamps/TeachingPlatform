import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import { createUser } from '../../actions/registration';
import RegistrationComponent from '../../components/registration';

export function mapStateToProps(state) {
  const { role } = getFormValues('registration')(state) || {};

  return {
    selectedRole: role,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    createUser: user => dispatch(createUser(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationComponent);
