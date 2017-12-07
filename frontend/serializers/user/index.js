import { Serializer } from 'jsonapi-serializer';

const UserSerializer = new Serializer('users', {
  attributes: [
    'email',
    'firstName',
    'lastName',
    'privacyPolicyAccepted',
    'currentPassword',
    'password',
    'passwordConfirmation',
    'unreadPostsPresent',
  ],
});

export default UserSerializer;
