import PropTypes from "prop-types";
import { attr } from "redux-orm";

import BaseModel from ".";

class Country extends BaseModel {}
Country.modelName = "Country";
Country.collectionKey = "countries";

Country.fields = {
  ...BaseModel.fields,
  id: attr(),
  code: attr(),
  name: attr(),
  postalCodeFormat: attr(),
  value: attr(),
  states: attr(),
};

Country.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  code: null,
  name: null,
  postalCodeFormat: null,
  value: null,
  states: {},
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  code: PropTypes.string,
  name: PropTypes.string,
  postalCodeFormat: PropTypes.string,
  value: PropTypes.string,
  states: PropTypes.object,
});

export default Country;
export { Shape };
