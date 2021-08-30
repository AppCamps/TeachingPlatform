import { normalize } from '../../../services/api/helpers';

export const user = {
  id: '10',
  email: 'hans@test.de',
};

export const session = {
  id: '',
  token: 'abc123',
  expireAfter: 10,
  user: '10',
};

export const requestData = `
{
  "data": {
    "type": "sessions",
    "attributes": {
      "email": "${user.email}",
      "password": "password123"
    }
  }
}
`;

/* eslint-disable max-len */
export const successResponse = `
{
  "data": {
    "id": "",
    "type": "sessions",
    "attributes": {
      "token": "${session.token}",
      "expire-after": ${session.expireAfter}
    },
    "relationships": {
      "user": {
        "data": {
          "id": "${user.id}",
          "type": "users"
        }
      }
    }
  },
  "included": [
    {
      "id": "${user.id}",
      "type": "users",
      "attributes": {
        "email": "${user.email}"
      }
    }
  ]
}
`;
/* eslint-enable max-len */
export const normalizedSuccessResponse = normalize()(JSON.parse(successResponse));

export const errorResponse = `
{
  "errors": [
    {
      "code": "invalid_email_or_password",
      "title": "Invalid email or password"
    }
  ]
}
`;
