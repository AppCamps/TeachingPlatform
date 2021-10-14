import PropTypes from "prop-types";
import { attr } from "redux-orm";

import BaseModel from ".";

class Expertise extends BaseModel {}
Expertise.modelName = "Expertise";

Expertise.fields = {
  ...BaseModel.fields,
  id: attr(),
  title: attr(),
  // expertises: many('Expertise', 'lessons'), (declared by Lesson)
};

Expertise.defaultProps = {
  ...BaseModel.defaultProps,
  title: "",
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
});

export default Expertise;
export { Shape };
