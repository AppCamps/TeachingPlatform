import { normalize } from "../../../services/api/helpers";

export const user = {
  id: "22",
  email: "Kennith_Parker98@hotmail.com",
  firstName: "Dariana",
  lastName: "Bashirian",
  privacyPolicyAccepted: true,
  currentPassword: "asdasdasd",
  password: "testtest",
  passwordConfirmation: "testtest",
};

export const requestData = `
{
    "data": {
        "id": "22",
        "type": "users",
        "attributes": {
            "email": "Kennith_Parker98@hotmail.com",
            "first-name": "Dariana",
            "last-name": "Bashirian",
            "privacy-policy-accepted": true,
            "current-password": "asdasdasd",
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
      "id": "22",
      "token": "8ay06eqkph2btvre6gce",
      "email": "Kennith_Parker98@hotmail.com",
      "first-name": "Dariana",
      "last-name": "Bashirian",
      "privacy-policy-accepted": true,
      "intercom-hash": "re8154dry1h26q6hlh3m",
      "created-at": 1483456284
    }
  }
}
`;

export const normalizedSuccessResponse = normalize()(
  JSON.parse(successResponse)
);

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
    email: "has already been taken",
  },
};
