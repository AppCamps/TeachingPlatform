import { Serializer } from 'jsonapi-serializer';

const CourseSchoolClassSerializer = new Serializer('course-school-class', {
  attributes: ['certificateDownloaded'],
});

export default CourseSchoolClassSerializer;
