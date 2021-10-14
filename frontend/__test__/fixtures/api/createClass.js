import { normalize } from "../../../services/api/helpers";

export const requestData = `
{
  "data": {
    "type": "classes",
    "attributes": {
      "resource-type": "extracurricular"
    }
  }
}
`;

/* eslint-disable */
export const successResponse = `
{
  "data": [
    {
      "id": "f71hd28d-39e1-4d4f-b833-d2a8b56c3cc9",
      "type": "classes",
      "attributes": {
        "resource-type": "extracurricular"
      },
      "relationships": {
        "user": {
          "data": {
            "id": "1184",
            "type": "users"
          }
        }
      }
    }
  ]
}`;

export const normalizedSuccessResponse = normalize()(
  JSON.parse(successResponse)
);
