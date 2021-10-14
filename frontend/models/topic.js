import PropTypes from "prop-types";
import { attr } from "redux-orm";

import BaseModel from ".";

class Topic extends BaseModel {}

Topic.modelName = "Topic";
Topic.sortFn = (klass) => new Topic(klass).title.toLowerCase();

Topic.fields = {
  ...BaseModel.fields,
  id: attr(),
  title: attr(),
  slug: attr(),
  // courses: many('Course', 'topic'), (declared by Course)
  // preparationMaterials: many('PreparationMaterial', 'topic'), (declared by PreparationMaterial)
};

Topic.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  title: "",
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  position: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string,
  lightColor: PropTypes.string,
  icon: PropTypes.string,
  slug: PropTypes.string,
});

export default Topic;
export { Shape };
export const defaults = Topic.defaultProps;
