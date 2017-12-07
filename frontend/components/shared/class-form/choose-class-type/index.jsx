import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import autobind from 'autobind-decorator';

import Button from '../../button';

import style from './style.scss';

class ChoseClassTypeComponent extends Component {
  @autobind
  handleOnSchoolClassClick() {
    this.changeValueAndSubmit('school_class');
  }

  @autobind
  handleOnExtracurricularClick() {
    this.changeValueAndSubmit('extracurricular');
  }

  changeValueAndSubmit(value) {
    const { change, handleSubmit, onDataChanged } = this.props;

    if (value === this.props.formValues.resourceType) {
      // Not changed
      handleSubmit();
      return;
    }

    change('resourceType', value);
    onDataChanged();

    // call handleSubmit after value has been set + propagated
    setTimeout(() => { handleSubmit(); }, 0);
  }

  render() {
    const { t } = this.context;
    const { resourceType } = this.props.formValues;

    const isSchoolClassSelected = resourceType === 'school_class';
    const isExtracurricularSelected = resourceType === 'extracurricular';

    return (
      <div className={style.chooseClassType}>
        <form>
          <h2>{t('Where will the class take place')}?</h2>
          <div>
            <div className={style.buttonContainer}>
              <Button
                isAction={isSchoolClassSelected}
                isSecondary={!isSchoolClassSelected}
                onClick={this.handleOnSchoolClassClick}
              >
                {t('School class')}
              </Button>
            </div>
            <div className={style.buttonContainer}>
              <Button
                isAction={isExtracurricularSelected}
                isSecondary={!isExtracurricularSelected}
                onClick={this.handleOnExtracurricularClick}
              >
                {t('Extracurricular')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

ChoseClassTypeComponent.propTypes = {
  ...reduxFormPropTypes,
  onDataChanged: PropTypes.func,
};

ChoseClassTypeComponent.contextTypes = {
  t: PropTypes.func.isRequired,
};

ChoseClassTypeComponent.defaultProps = {
  onDataChanged: () => {},
};

export default reduxForm({
  form: 'classForm',
  enableReinitialize: false,
  keepDirtyOnReinitialize: true,
  destroyOnUnmount: false,
  initialValues: { resourceType: null },
  // overwrite validation for back case
  validate: () => ({}),
})(ChoseClassTypeComponent);
