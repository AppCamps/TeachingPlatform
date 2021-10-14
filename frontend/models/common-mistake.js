import PropTypes from "prop-types";
import { attr, many } from "redux-orm";

import BaseModel from ".";

class CommonMistake extends BaseModel {}
CommonMistake.modelName = "CommonMistake";

CommonMistake.fields = {
  ...BaseModel.fields,
  id: attr(),
  position: attr(),
  problem: attr(),
  solution: attr(),
  lessons: many("Lesson", "commonMistakes"),
};

CommonMistake.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  position: null,
  problem: "",
  solution: "",
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  position: PropTypes.number,
  problem: PropTypes.string,
  solution: PropTypes.string,
});

export default CommonMistake;
export { Shape };
