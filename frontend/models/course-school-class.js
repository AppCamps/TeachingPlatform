import PropTypes from 'prop-types';
import { attr, fk } from 'redux-orm';

import BaseModel from '.';

class CourseSchoolClass extends BaseModel {}
CourseSchoolClass.modelName = 'CourseSchoolClass';
CourseSchoolClass.collectionKey = 'courseSchoolClasses';

CourseSchoolClass.fields = {
  ...BaseModel.fields,
  id: attr(),
  certificateDownloaded: attr(),
  certificateUrl: attr(),
  course: fk('Course', 'courseSchoolClasses'),
  schoolClass: fk('Class', 'courseSchoolClasses'),
};

const Shape = PropTypes.shape({
  certificateDownloaded: PropTypes.bool.isRequired,
  certificateUrl: PropTypes.string,
});

export default CourseSchoolClass;
export { Shape };
