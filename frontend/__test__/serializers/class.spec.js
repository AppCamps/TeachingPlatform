import { expect } from '../chai_helper';
import factory from '../__factories__';

import ClassSerializer from '../../serializers/class';

describe('ClassSerializer', () => {
  describe('serialize', () => {
    it('serializes resourceType: "school_class"', () => {
      const schoolClass = factory.build('schoolClass', {
        courses: ['2', '3'],
      });

      const expectation = {
        data: {
          type: 'classes',
          id: schoolClass.id,
          attributes: {
            'resource-type': schoolClass.resourceType,
            'class-name': schoolClass.className,
            'school-year': schoolClass.schoolYear,
            grade: schoolClass.grade,
            'planned-school-usage': schoolClass.plannedSchoolUsage,
            'school-subject': schoolClass.schoolSubject,
            'girl-count': schoolClass.girlCount,
            'boy-count': schoolClass.boyCount,
          },
          relationships: {
            courses: {
              data: schoolClass.courses.map(id => ({
                id,
                type: 'courses',
              })),
            },
            'completed-lessons': {
              data: [],
            },
          },
        },
      };

      expect(ClassSerializer.serialize(schoolClass)).to.deep.eql(expectation);
    });

    it('serializes resourceType: "extracurricular"', () => {
      const extracurricularClass = factory.build('extracurricular');

      const expectation = {
        data: {
          type: 'classes',
          id: extracurricularClass.id,
          attributes: {
            'resource-type': extracurricularClass.resourceType,
            'group-name': extracurricularClass.groupName,
            year: extracurricularClass.year,
            age: extracurricularClass.age,
            'planned-extracurricular-usage': extracurricularClass.plannedExtracurricularUsage,
            'girl-count': extracurricularClass.girlCount,
            'boy-count': extracurricularClass.boyCount,
          },
          relationships: {
            courses: {
              data: extracurricularClass.courses.map(id => ({
                id,
                type: 'courses',
              })),
            },
            'completed-lessons': {
              data: [],
            },
          },
        },
      };

      expect(ClassSerializer.serialize(extracurricularClass))
        .to.deep.eql(expectation);
    });
  });
});
