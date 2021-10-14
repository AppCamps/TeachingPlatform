import { normalize } from "../../../services/api/helpers";

export const requestData = (courseSchoolClass) => `
{
  "data": {
    "type": "course-school-classes",
    "id": "${courseSchoolClass.id}",
    "attributes": {
      "certificate-downloaded": true
    }
  }
}
`;

export const successResponse = (courseSchoolClass) => `
{
  "data": {
    "id": "${courseSchoolClass.id}",
    "type": "course-school-classes",
    "attributes": {
      "certificate-downloaded": true,
      "certificate-url": "https://appcamps-dev.s3.eu-central-1.amazonaws.com/store/f33465012b055f3924d85038e918aec1.png?response-content-disposition=attachment%3Bfilename%3Dzertifikat-rettungstruppe-aufbaukurs-knobelapps.png&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJEEVJHCXKCBZJDEA%2F20170913%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20170913T110648Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=985a11453c63bb0fd73e8d97375015889449ed2acee4f23b14c8486e0546a2f1"
    },
    "relationships": {
      "course": {
        "data": {
          "id": "${courseSchoolClass.course.id}",
          "type": "courses"
        }
      },
      "school-class": {
        "data": {
          "id": "${courseSchoolClass.schoolClass.id}",
          "type": "school-classes"
        }
      }
    }
  }
}
`;

export const normalizedSuccessResponse = (courseSchoolClass) =>
  normalize()(JSON.parse(successResponse(courseSchoolClass)));
