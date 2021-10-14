import PropTypes from "prop-types";
import { attr, fk } from "redux-orm";

import BaseModel from ".";

class Locality extends BaseModel {}
Locality.modelName = "Locality";
Locality.collectionKey = "localities";

Locality.fields = {
  ...BaseModel.fields,
  schoolType: attr(),
  schoolTypeCustom: attr(),
  schoolName: attr(),
  country: attr(),
  state: attr(),
  city: attr(),
  postalCode: attr(),
  user: fk("User"),
};

Locality.defaultProps = {
  ...BaseModel.defaultProps,
  schoolType: null,
  schoolTypeCustom: null,
  schoolName: null,
  country: null,
  state: null,
  city: null,
  postalCode: null,
};

const Shape = PropTypes.shape({
  schoolType: PropTypes.string,
  schoolTypeCustom: PropTypes.string,
  schoolName: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  city: PropTypes.string,
  postalCode: PropTypes.string,
});

export default Locality;
export { Shape };
