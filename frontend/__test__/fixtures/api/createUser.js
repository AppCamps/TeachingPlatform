import { normalize } from '../../../services/api/helpers';

import factory from '../../__factories__';

export const user = factory.build('registration', {
  email: 'test1@appcamps.de',
  firstName: 'Test',
  lastName: 'User',
  role: 'role_teacher',
  privacyPolicyAccepted: true,
  referal: 'test123',
  password: 'testtest',
  passwordConfirmation: 'testtest',
});

export const requestData = `
{
    "data": {
        "attributes": {
            "email": "test1@appcamps.de",
            "first-name": "Test",
            "last-name": "User",
            "role": "role_teacher",
            "privacy-policy-accepted": "true",
            "referal": "test123",
            "password": "testtest",
            "password-confirmation": "testtest"
        }
    }
}
`;

export const successResponse = `
{
  "data": {
    "id": "22",
    "type": "users",
    "attributes": {
      "email": "test1@appcamps.de",
      "full-name": "Test User",
      "first-name": "Test",
      "created-at": 1486474513,
      "intercom-hash": "7b376f09062953203b9854c8d0f1cd908c553bcb5ffa40ba84eb7f9f904ed29d",
      "privacy-policy-accepted": true
    }
  }
}
`;

export const normalizedSuccessResponse = normalize()(JSON.parse(successResponse));

export const errorResponse = `
{
  "errors": [
    {
      "source": {
        "pointer": "/data/attributes/email"
      },
      "detail": "has already been taken"
    }
  ]
}
`;

export const normalizedErrorResponse = {
  errors: {
    email: 'has already been taken',
  },
};
