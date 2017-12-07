import { Serializer } from 'jsonapi-serializer';

const ClassSerializer = new Serializer('classes', {
  nullIfMissing: true,
  attributes: [
    'resourceType',
    'className',
    'schoolYear',
    'grade',
    'plannedSchoolUsage',
    'schoolSubject',
    'girlCount',
    'boyCount',
    'courses',
    'completedLessons',
  ],
  courses: {
    ref: (_object, courseId) => courseId,
    included: false,
  },
  completedLessons: {
    ref: (_object, lessonId) => lessonId,
    included: false,
  },
});

export default ClassSerializer;
