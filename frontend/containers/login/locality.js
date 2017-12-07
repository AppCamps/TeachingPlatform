import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import { schoolTypes } from '../../config';

import LocalityComponent from '../../components/login/locality';
import { countriesSelector } from '../../selectors/shared/countries';
import { userSelector } from '../../selectors/shared/user';
import { fetchCountries } from '../../actions/countries';
import { createInitialLocality } from '../../actions/authentication';

export function mapStateToProps(state) {
  const formValues = getFormValues('localityForm')(state) || {};
  const { country, schoolType } = formValues;
  const countries = countriesSelector(state);

  let schoolTypeCustom = null;
  if (schoolType && !Object.keys(schoolTypes).includes(schoolType)) {
    schoolTypeCustom = schoolType;
  }

  const countryOptions = countries.map(({ value, name }) => ({ value, label: name }));
  const selectedCountry = countries.find(c => country === c.value);
  const states = selectedCountry ? selectedCountry.states : {};
  const stateOptions =
    Object.keys(states).map(key => ({ value: key.toUpperCase(), label: states[key] }));

  return {
    formValues,
    schoolTypeCustom,
    countryOptions,
    stateOptions,
    selectedCountry,
    countries,
    user: userSelector(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    createLocality: formData => dispatch(createInitialLocality(formData)),
    fetchCountries: () => dispatch(fetchCountries()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalityComponent);
