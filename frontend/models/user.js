import PropTypes from 'prop-types';
import { attr, fk } from 'redux-orm';

import BaseModel from '.';

class User extends BaseModel {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get includeRef() {
    return Object.assign(super.includeRef, {
      fullName: this.fullName,
    });
  }
}

User.modelName = 'User';

User.fields = {
  ...BaseModel.fields,
  id: attr(),
  email: attr(),
  unconfirmedEmail: attr(),
  firstName: attr(),
  lastName: attr(),
  privacyPolicyAccepted: attr(),
  intercomHash: attr(),
  createdAt: attr(),
  teacher: attr(),
  schoolClassesCount: attr(),
  unreadPostsPresent: attr(),
  locality: fk('Locality'),
};

User.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  email: null,
  unconfirmedEmail: null,
  firstName: null,
  lastName: null,
  privacyPolicyAccepted: false,
  intercomHash: null,
  createdAt: null,
  teacher: false,
  unreadPostsPresent: false,
  schoolClassesCount: 0,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  createdAt: PropTypes.number,
  email: PropTypes.string,
  unconfirmedEmail: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  privacyPolicyAccepted: PropTypes.bool,
  intercomHash: PropTypes.string,
  teacher: PropTypes.bool.isRequired,
  unreadPostsPresent: PropTypes.bool,
  schoolClassesCount: PropTypes.number.isRequired,
});

export default User;
export { Shape };
