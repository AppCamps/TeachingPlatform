import { normalize } from '../../../services/api/helpers';

/* eslint-disable */
export const successResponse = `
{
  "data": [
    {
      "id": "d4af2a49-ab84-4857-bcb3-31cd649ec3f0",
      "type": "topics",
      "attributes": {
        "title": "App development"
      },
      "relationships": {
        "preparation-materials": {
          "data": [
            {
              "id": "9b02a1df-4bd7-4032-b594-bdcd90bbe587",
              "type": "preparation-materials"
            }
          ]
        }
      }
    },
    {
      "id": "aae712ba-3d3b-48fe-acea-67f2cce8b7d3",
      "type": "topics",
      "attributes": {
        "title": "HTML & CSS"
      }
    }
  ],
  "included": [
    {
      "id": "9b02a1df-4bd7-4032-b594-bdcd90bbe587",
      "type": "preparation-materials",
      "attributes": {
        "medium-type": "medium_type_document",
        "title": "Lernkarten",
        "subtitle": "4 Seiten",
        "link": "https://lerne",
        "description": "Lernkarten diggi.",
        "icon": "file-pdf-o",
        "position": 0
      }
    }
  ]
}
`;

export const normalizedSuccessResponse = normalize()(JSON.parse(successResponse));
