import PropTypes from 'prop-types';
import { attr, fk } from 'redux-orm';

import BaseModel from '.';

class PreparationMaterial extends BaseModel {}

PreparationMaterial.modelName = 'PreparationMaterial';

PreparationMaterial.fields = {
  ...BaseModel.fields,
  id: attr(),
  position: attr(),
  title: attr(),
  subtitle: attr(),
  description: attr(),
  mediumType: attr(),
  icon: attr(),
  link: attr(),
  topic: fk('Topic', 'preparationMaterials'),
};

PreparationMaterial.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  position: null,
  title: '',
  subtitle: '',
  description: '',
  mediumType: null,
  icon: null,
  link: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  position: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  mediumType: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.string,
});

export default PreparationMaterial;
export { Shape };
