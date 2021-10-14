import { connect } from "react-redux";
import pick from "lodash.pick";

import { localitySelector } from "../../selectors/edit-user";

import { createLocality } from "../../actions/locality";
import { fetchCountries } from "../../actions/countries";

import EditUserLocalityComponent from "../../components/edit-user/locality";

import { mapStateToProps as localityMapStateToProps } from "../login/locality";

export function mapStateToProps(state) {
  const initialValues = pick(localitySelector(state), [
    "schoolType",
    "schoolTypeCustom",
    "schoolName",
    "subjects",
    "state",
    "country",
    "postalCode",
    "city",
  ]);

  return {
    ...localityMapStateToProps(state),
    initialValues,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    createLocality: (locality) => dispatch(createLocality(locality)),
    fetchCountries: () => dispatch(fetchCountries()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserLocalityComponent);
