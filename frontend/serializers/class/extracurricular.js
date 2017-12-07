import { Serializer } from 'jsonapi-serializer';

const ExtracurricularSerializer = new Serializer('classes', {
  nullIfMissing: true,
  attributes: [
    'resourceType',
    'groupName',
    'year',
    'age',
    'plannedExtracurricularUsage',
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

export default ExtracurricularSerializer;
