import React from "react";
import PropTypes from "prop-types";

import LocalityForm from "../../shared/locality-form";

import { Shape as UserShape } from "../../../models/user";
import { Shape as CountryShape } from "../../../models/country";

import style from "./style.scss";

function CreateLocality(props, context) {
  const { t } = context;

  return (
    <div className={style.container}>
      <div className={style.locality}>
        <h1 className={style.heading}>{t("Welcome to App Camps")}</h1>
        <div className={style.localityForm}>
          <p className={style.info}>
            {t(
              "It is crucial for us to know, where our materials are used. Before you can setup your classes, we need you to tell us a bit more about you."
            )}
          </p>
          <LocalityForm {...props} />
        </div>
      </div>
    </div>
  );
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
  })
);

CreateLocality.propTypes = {
  createLocality: PropTypes.func.isRequired,
  fetchCountries: PropTypes.func.isRequired,
  user: UserShape.isRequired,
  formValues: FormShape.isRequired,
  selectedCountry: CountryShape.isRequired,
  countryOptions: OptionShape.isRequired,
  stateOptions: OptionShape.isRequired,
};

CreateLocality.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CreateLocality;
