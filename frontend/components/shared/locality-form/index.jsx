import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes as formPropTypes } from 'redux-form';
import autobind from 'autobind-decorator';

import { schoolTypes, constants } from '../../../config';
import { translatedFormError } from '../../../utils/translations';
import { cleanRegExpString } from '../../../utils';

import Button from '../../shared/button';
import Spinner from '../../shared/spinner';
import SelectWithLabel from '../../shared/select-with-label';
import InputWithLabel from '../../shared/input-with-label';

import { Shape as UserShape } from '../../../models/user';
import { Shape as CountryShape } from '../../../models/country';

import style from './style.scss';

const primaryCountries = constants.PRIMARY_COUNTRIES;

const isPostalCodeRequired = selectedCountry =>
  !selectedCountry || primaryCountries.indexOf(selectedCountry.code) !== -1;

class LocalityForm extends Component {

  componentDidMount() {
    this.props.fetchCountries();
  }

  componentWillReceiveProps({ schoolTypeCustom }) {
    if (this.props.schoolTypeCustom !== schoolTypeCustom) {
      this.props.change('schoolTypeCustom', schoolTypeCustom);
    }
  }

  @autobind
  handleSubmit(formValues) {
    const { initialize, createLocality, pristine } = this.props;
    if (pristine) { return () => Promise.resolve(); }

    return createLocality(formValues).then(() => {
      initialize({ ...formValues });
    });
  }

  schoolTypeOptions() {
    const { t } = this.context;
    const { schoolType } = this.props.formValues;

    const options = Object.keys(schoolTypes).map(value =>
      ({ value, label: t(schoolTypes[value]) }),
    );
    if (schoolType && !options.map(({ value }) => value).includes(schoolType)) {
      options.push({ value: schoolType, label: schoolType });
    }
    return options;
  }

  render() {
    const { t } = this.context;
    const {
      user: { teacher },
      selectedCountry,
      countryOptions,
      stateOptions,
      formValues,
      submitSucceeded,
      pristine,
      submitting,
      change,
      untouch,
    } = this.props;

    let schoolClassForm = null;
    let nonTeacherSubjectsField = null;
    if (teacher) {
      const schoolClassSelectProps = {
        options: this.schoolTypeOptions(),
        placeholder: t('Enter school type'),
        creatable: true,
      };
      schoolClassForm = (
        <div>
          <div className={style.schoolType}>
            <Field required name="schoolType" label={t('School type')} selectProps={schoolClassSelectProps} component={SelectWithLabel} />
            <Field name="schoolTypeCustom" type="hidden" component="input" />
          </div>
          <div className={style.schoolName}>
            <Field name="schoolName" label={t('School name')} component={InputWithLabel} />
          </div>
          <div className={style.schoolSubjects}>
            <Field required name="subjects" label={t('Subjects')} component={InputWithLabel} />
          </div>
        </div>
      );
    } else {
      nonTeacherSubjectsField = (
        <div className={style.profession}>
          <Field required name="subjects" label={t('Profession / professional background')} component={InputWithLabel} />
        </div>
      );
    }

    const countrySelectProps = {
      options: countryOptions,
      priority: primaryCountries,
      placeholder: t('Enter country'),
    };

    let stateTranslation;
    switch (selectedCountry && selectedCountry.code) {
      case 'CHE':
        stateTranslation = t('Canton');
        break;
      case 'DEU':
      case 'AUT':
        stateTranslation = t('Federal state');
        break;
      case 'USA':
        stateTranslation = t('State');
        break;
      case 'PRT':
        stateTranslation = t('District');
        break;
      default:
        stateTranslation = t('Region');
    }
    const isStateRequired = stateOptions.length > 0;
    const stateSelectProps = {
      options: stateOptions,
      placeholder: isStateRequired ? t('Choose {entity}', { entity: stateTranslation }) : t(''),
      disabled: !isStateRequired,
    };
    const stateComponent = (
      <Field
        required={isStateRequired}
        name="state"
        label={stateTranslation}
        value={formValues.state}
        selectProps={stateSelectProps}
        component={SelectWithLabel}
      />
    );

    let submitIcon = null;
    let buttonText = t('Save');
    if (submitSucceeded && pristine) {
      submitIcon = 'check';
      buttonText = t('Saved');
    }

    return (
      <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        {schoolClassForm}
        <div>
          <div className={style.country}>
            <Field
              required
              name="country"
              label={t('Country')}
              value={formValues.country}
              selectProps={countrySelectProps}
              onChange={() => {
                untouch('state', 'postalCode');
                change('state', null);
              }}
              component={SelectWithLabel}
            />
          </div>
          <div className={style.state}>
            {stateComponent}
          </div>
          <div className={style.postalCode}>
            <Field
              name="postalCode"
              label={t('Postal code')}
              value="test"
              component={InputWithLabel}
            />
          </div>
          <div className={style.city}>
            <Field
              name="city"
              label={t('City')}
              component={InputWithLabel}
            />
          </div>
        </div>
        <div>
          {nonTeacherSubjectsField}
        </div>
        <div className={style.buttonContainer}>
          <Spinner visible={submitting} />
          <Button isAction type="submit" disabled={submitting} leftIcon={submitIcon}>
            {buttonText}
          </Button>
        </div>
      </form>
    );
  }
}

export const FormShape = PropTypes.shape({
  schoolType: PropTypes.string,
  schoolName: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  postalCode: PropTypes.string,
  city: PropTypes.string,
});

const OptionShape = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
);

LocalityForm.propTypes = {
  ...formPropTypes,
  createLocality: PropTypes.func.isRequired,
  fetchCountries: PropTypes.func.isRequired,
  user: UserShape,
  formValues: FormShape,
  selectedCountry: CountryShape,
  countryOptions: OptionShape,
  stateOptions: OptionShape,
};

LocalityForm.defaultProps = {
  user: null,
  formValues: null,
  selectedCountry: null,
  countryOptions: null,
  stateOptions: null,
};

LocalityForm.defaultProps = {
  hideProfession: false,
};

LocalityForm.contextTypes = {
  t: PropTypes.func.isRequired,
};

export const validate = (values, props) => {
  const errors = {};
  const { user: { teacher }, selectedCountry, hideProfession, stateOptions } = props;

  const requiredAttributes = ['country'];
  if (teacher) {
    requiredAttributes.push('schoolType', 'subjects');
  } else if (!hideProfession) {
    requiredAttributes.push('subjects');
  }
  if (stateOptions.length > 0) {
    requiredAttributes.push('state');
  }

  requiredAttributes.forEach((key) => {
    if (!values[key] || values[key].trim() === '') {
      errors[key] = translatedFormError('required');
    }
  });

  if (selectedCountry && selectedCountry.postalCodeFormat && values.postalCode) {
    const regex = new RegExp(cleanRegExpString(selectedCountry.postalCodeFormat));
    if (!values.postalCode.match(regex)) {
      errors.postalCode = translatedFormError('invalid');
    }
  }

  return errors;
};

export default reduxForm({
  form: 'localityForm',
  validate,
})(LocalityForm);
