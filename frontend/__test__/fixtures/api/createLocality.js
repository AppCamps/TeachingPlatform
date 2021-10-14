import { normalize } from "../../../services/api/helpers";

export const locality = {
  schoolType: "school_type_university",
  schoolName: "App Camps",
  country: "country_de",
  state: "HH",
  postalCode: "20357",
  city: "Hamburg",
};

export const requestData = `
{
    "data": {
        "attributes": {
          "school-type": "school_type_university",
          "school-name": "App Camps",
          "country": "country_de",
          "state": "HH",
          "postal-code": "20357",
          "city": "Hamburg"
        }
    }
}
`;

export const successResponse = `
{
  "data": {
    "id": "8b2791a3-a3c3-4add-87fe-dad75d47d532",
    "type": "localities",
    "relationships": {
      "user": {
        "data": {
          "id": "12",
          "type": "users"
        }
      }
    }
  },
  "included": [
    {
      "id": "12",
      "type": "users",
      "attributes": {
        "email": "test@appcamps.de",
        "full-name": "Testa Test",
        "first-name": "Testa",
        "created-at": 1489946846,
        "intercom-hash": "intercom-hash",
        "privacy-policy-accepted": true,
        "locality": true,
        "teacher": true
      }
    }
  ]
}`;

export const normalizedSuccessResponse = normalize()(
  JSON.parse(successResponse)
);

export const errorResponse = `
{
  "errors": [
    {
      "source": {
        "pointer": "/data/attributes/postal-code"
      },
      "detail": "Invalid"
    }
  ]
}
`;

export const normalizedErrorResponse = {
  errors: {
    postalCode: "Invalid",
  },
};
