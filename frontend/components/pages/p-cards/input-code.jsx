import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes } from 'redux-form';
import autobind from 'autobind-decorator';
import Container from '../../shared/container';
import Button from '../../shared/button';
import InputWithLabel from '../../shared/input-with-label';

import style from './style.scss';
import { translatedFormError } from '../../../utils/translations';

class InputCodePage extends Component {

  @autobind
  onSubmit({ code }) {
    const { setCode } = this.props;
    setCode(code);
  }

  render() {
    const { t } = this.context;
    const { handleSubmit, submitting } = this.props;

    return (
      <div className={style.formContainer}>
        <Container>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              component={InputWithLabel}
              disabled={submitting}
              name="code"
              label={t('Code')}
              required
            />
            <div>
              <span>
                <Button isAction type="submit" disabled={submitting} rightIcon="angle-right">
                  {t('To the card')}
                </Button>
              </span>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

InputCodePage.contextTypes = {
  t: PropTypes.func.isRequired,
};

InputCodePage.propTypes = {
  ...propTypes,
  setCode: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { code } = values;

  if (!code) {
    errors.code = translatedFormError('required');
  }

  return errors;
};

export default reduxForm({
  form: 'passwordResetRequestForm',
  validate,
})(InputCodePage);
