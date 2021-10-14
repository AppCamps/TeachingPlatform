import PropTypes from "prop-types";
import { attr } from "redux-orm";

import BaseModel from ".";

class Class extends BaseModel {
  formValues() {
    const values = this.includeRef;
    delete values.completedLessons;
    delete values.isFetched;

    return values;
  }

  get isSchoolClass() {
    return this.resourceType === "school_class";
  }

  get title() {
    return this.isSchoolClass ? this.className : this.groupName;
  }

  get identifier() {
    return this.isSchoolClass ? this.schoolYear : this.year;
  }

  get includeRef() {
    return Object.assign(super.includeRef, {
      title: this.title,
      identifier: this.identifier,
      isSchoolClass: this.isSchoolClass,
    });
  }
}
Class.modelName = "Class";
Class.collectionKey = "classes";
Class.sortFn = (klass) => new Class(klass).title.toLowerCase();

Class.fields = {
  ...BaseModel.fields,
  id: attr(),
  resourceType: attr(),
  className: attr(),
  schoolYear: attr(),
  grade: attr(),
  girlCount: attr(),
  boyCount: attr(),
  plannedSchoolUsage: attr(),
  schoolSubject: attr(),
  groupName: attr(),
  year: attr(),
  age: attr(),
  plannedExtracurricularUsage: attr(),
  completedLessons: attr(), // only ids are needed for completedLessons
  // declared on course
  // courses: many({
  //   to: 'Course',
  //   through: 'CourseSchoolClass',
  //   relatedName: 'classes',
  //   throughFields: ['course', 'schoolClass'],
  // }),
};

Class.defaultProps = {
  ...BaseModel.defaultProps,
  resourceType: null,
  className: null,
  schoolYear: null,
  grade: null,
  girlCount: null,
  boyCount: null,
  plannedSchoolUsage: null,
  schoolSubject: null,
  groupName: null,
  year: null,
  age: null,
  plannedExtracurricularUsage: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  resourceType: PropTypes.string,
  className: PropTypes.string,
  schoolYear: PropTypes.string,
  grade: PropTypes.string,
  girlCount: PropTypes.string,
  boyCount: PropTypes.string,
  plannedSchoolUsage: PropTypes.string,
  schoolSubject: PropTypes.string,
  groupName: PropTypes.string,
  year: PropTypes.string,
  age: PropTypes.string,
  plannedExtracurricularUsage: PropTypes.string,
});

export default Class;
export const sortFn = Class.sortFn;
export { Shape };
