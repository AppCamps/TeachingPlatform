import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import { slugify } from '../utils';

import BaseModel from '.';

class Lesson extends BaseModel {
  get slug() {
    return slugify(this.title);
  }

  get includeRef() {
    return Object.assign(super.includeRef, {
      slug: this.slug,
    });
  }
}
Lesson.modelName = 'Lesson';

Lesson.fields = {
  ...BaseModel.fields,
  id: attr(),
  position: attr(),
  title: attr(),
  description: attr(),
  expertises: many('Expertise', 'lessons'),
  course: fk('Course', 'lessons'),
  // teachingMaterials: many('TeachingMaterial', 'lesson'),  (declared by TeachingMaterial)
  // commonMistakes: many('CommonMistake', 'lesson'),  (declared by CommonMistake)
};

Lesson.defaultProps = {
  ...BaseModel.defaultProps,
  title: '',
  position: null,
  description: '',
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  slug: PropTypes.string,
});

export default Lesson;
export { Shape };
