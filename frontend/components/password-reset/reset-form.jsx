import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes } from 'redux-form';
import { Link } from 'react-router';
import autobind from 'autobind-decorator';

import { translatedFormError } from '../../utils/translations';

import Container from '../shared/container';
import Button from '../shared/button';
import Spinner from '../shared/spinner';
import InputWithLabel from '../shared/input-with-label';

import style from './style.scss';

class PasswordReset extends Component {

  @autobind
  onSubmit(formData) {
    const { passwordReset, passwordResetToken } = this.props;
    return passwordReset(formData, passwordResetToken);
  }

  render() {
    const { t } = this.context;
    const { handleSubmit, submitting } = this.props;

    return (
      <div className={style.container}>
        <Container>
          <h1 className={style.heading}>{t('Password reset')}</h1>
          <Link className={style.loginLink} to={'/'}>{t('cancel')}</Link>
          <form className={style.passwordResetRequestForm} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              component={InputWithLabel}
              disabled={submitting}
              name="password"
              label={t('Password')}
              type="password"
              required
            />
            <Field
              component={InputWithLabel}
              disabled={submitting}
              name="passwordConfirmation"
              label={t('Password confirmation')}
              type="password"
              required
            />
            <div className={style.actions}>
              <span className={style.submit}>
                <Spinner visible={submitting} />
                <Button isAction type="submit" disabled={submitting} rightIcon="angle-right">
                  {t('Send')}
                </Button>
              </span>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

PasswordReset.propTypes = {
  ...propTypes,
  passwordReset: PropTypes.func.isRequired,
};

PasswordReset.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { password, passwordConfirmation } = values;

  if (!password) {
    errors.password = translatedFormError('required');
  }

  if (password && password.length < 8) {
    errors.password = translatedFormError('minimumCharCount', { min: 8 });
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = translatedFormError('required');
  }

  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = translatedFormError('notEqual');
  }

  return errors;
};

export default reduxForm({
  form: 'passwordResetForm',
  validate,
})(PasswordReset);
