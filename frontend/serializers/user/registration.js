import { Serializer } from 'jsonapi-serializer';

const UserRegistrationSerializer = new Serializer('users', {
  attributes: [
    'role', 'email', 'firstName', 'lastName', 'referal', 'comment',
    'password', 'passwordConfirmation', 'privacyPolicyAccepted',
  ],
});

export default UserRegistrationSerializer;
