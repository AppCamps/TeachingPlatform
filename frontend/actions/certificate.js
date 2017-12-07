import { updateCourseSchoolClass } from '../services/api';
import { apiFetched } from './api';

import CourseSchoolClassSerializer from '../serializers/course-school-class';

export function downloadCertificate(courseSchoolClass) {
  return (dispatch) => {
    let promise = Promise.resolve(courseSchoolClass);

    if (!courseSchoolClass.certificateUrl) {
      const serializedCourseSchoolClass = CourseSchoolClassSerializer.serialize({
        ...courseSchoolClass,
        certificateDownloaded: true,
      });

      promise = updateCourseSchoolClass(serializedCourseSchoolClass).then((payload) => {
        dispatch(apiFetched(payload));
        return Promise.resolve(payload.courseSchoolClasses[courseSchoolClass.id]);
      });
    }

    return promise.then((_courseSchoolClass) => {
      const { certificateUrl } = _courseSchoolClass;

      if (certificateUrl) {
        window.open(certificateUrl, '_self');
      }
    });
  };
}
