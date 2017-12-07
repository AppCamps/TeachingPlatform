import { normalize } from '../../../services/api/helpers';

/* eslint-disable */
export const successResponse = `
{
  "data": [
    {
      "id": "6",
      "type": "courses",
      "attributes": {
        "title": "Vorbereitung: 'App Entwicklung mit SuS'",
        "description": "Welche Vorbereitungen sind nötig (Installation, Lernkarten/Materialien drucken)? Wie läuft der Kurs ab? Welche Inhalte werden vermittelt? Hier finden Sie alle wichtigen Infos zur Vorbereitung sowie Online Schulungsmodule, um sich auf den Kurs vorzubereiten.",
        "slug": "introduction"
      },
      "relationships": {
        "topic": {
          "data": {
            "id": "cdc1f9ea-f6f9-4baa-9e04-f842fafe4d9f",
            "type": "topics"
          }
        },
        "lessons": {
          "data": [
            {
              "id": "11",
              "type": "lessons"
            },
            {
              "id": "21",
              "type": "lessons"
            }
          ]
        }
      }
    },
    {
      "id": "5",
      "type": "courses",
      "attributes": {
        "title": "Kurs: App Entwicklung mit Schülerinnen und Schülern",
        "description": "Für jede Sitzung (ca. 90 Minuten) finden Sie hier: 1.) Ein Startvideo, in dem die App vorgestellt wird, 2.) Lernkarten zum selbstständigen Arbeiten und 3.) ein Abschlussvideo, in dem verschiedene Entwickler/innen Konzepte der Informatik erklären.",
        "slug": "apps"
      },
      "relationships": {
        "topic": {
          "data": {
            "id": "cdc1f9ea-f6f9-4baa-9e04-f842fafe4d9f",
            "type": "topics"
          }
        },
        "lessons": {
          "data": [
            {
              "id": "20",
              "type": "lessons"
            }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "id": "cdc1f9ea-f6f9-4baa-9e04-f842fafe4d9f",
      "type": "topics",
      "attributes": {
        "title": "App development"
      }
    },
    {
      "id": "a0f7a5f5-e807-4c48-82cc-82eed449046e",
      "type": "teaching-materials",
      "attributes": {
        "medium-type": "medium_type_video",
        "title": "Kusrvorbereitung",
        "subtitle": "(3:21)",
        "image": "https://appcamps-dev.s3.eu-central-1.amazonaws.com/store/5471fa3b449cad37c777ece7b331d02f.png",
        "link": "https://embedwistia-a.akamaihd.net/deliveries/4455c06f8d1a7809a199a429de3ed98ebf17488b/file.mp4",
        "lesson-content": true,
        "listing-item": false,
        "listing-title": "",
        "listing-icon": null
      }
    },
    {
      "id": "046f6277-3a17-4105-94d5-1d98f9d025b8",
      "type": "teaching-materials",
      "attributes": {
        "medium-type": "medium_type_other",
        "title": "Lernen mit Lernkarten",
        "subtitle": "",
        "image": "https://appcamps-dev.s3.eu-central-1.amazonaws.com/store/bbc0a5fe9cc588049b7d4ac189fbe4e0.png",
        "link": "http://test.de",
        "lesson-content": true,
        "listing-item": true,
        "listing-title": "Lernkarten",
        "listing-icon": "paperclip"
      }
    },
    {
      "id": "11",
      "type": "lessons",
      "attributes": {
        "title": "0: Allgemeines zum Kurs und zu den Unterlagen",
        "description": "0"
      },
      "relationships": {
        "teaching-materials": {
          "data": [
            {
              "id": "a0f7a5f5-e807-4c48-82cc-82eed449046e",
              "type": "teaching-materials"
            },
            {
              "id": "046f6277-3a17-4105-94d5-1d98f9d025b8",
              "type": "teaching-materials"
            }
          ]
        }
      }
    },
    {
      "id": "21",
      "type": "lessons",
      "attributes": {
        "title": "1: Online Schulung",
        "description": "Online Schulung für Lehrende"
      },
      "relationships": {
        "teaching-materials": {
          "data": []
        }
      }
    },
    {
      "id": "20",
      "type": "lessons",
      "attributes": {
        "title": "0: Bevor es losgeht - Infos und Fragebogen",
        "description": "00"
      },
      "relationships": {
        "teaching-materials": {
          "data": []
        }
      }
    }
  ]
}
`;

export const normalizedSuccessResponse = normalize()(JSON.parse(successResponse));
