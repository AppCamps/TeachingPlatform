import { normalize } from "../../../services/api/helpers";

/* eslint-disable */
export const successResponse = `
{
  "data": [
    {
      "id": "f70dd28d-39e1-4d4f-b833-d2a8b56c3cc9",
      "type": "classes",
      "attributes": {
        "resource-type": "school_class"
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

export const normalizedSuccessResponse = normalize(JSON.parse(successResponse));
