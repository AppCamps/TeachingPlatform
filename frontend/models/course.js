import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from '.';

class Course extends BaseModel {}
Course.modelName = 'Course';

Course.fields = {
  ...BaseModel.fields,
  id: attr(),
  position: attr(),
  title: attr(),
  description: attr(),
  slug: attr(),
  certificate: attr(),
  topic: fk('Topic', 'courses'),
  // lessons: many('Lesson', 'course') (declared by Lesson)
  schoolClasses: many({
    to: 'Class',
    through: 'CourseSchoolClass',
    relatedName: 'courses',
    throughFields: ['schoolClass', 'course'],
  }),
};

Course.defaultProps = {
  ...BaseModel.defaultProps,
  title: '',
  position: null,
  description: '',
  slug: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  slug: PropTypes.string,
});

export default Course;
export { Shape };
