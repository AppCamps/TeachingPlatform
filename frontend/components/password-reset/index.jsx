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
import { constants } from '../../config';

import style from './style.scss';

class PasswordResetRequest extends Component {

  @autobind
  onSubmit(formData) {
    const { passwordResetRequest } = this.props;
    return passwordResetRequest(formData);
  }

  render() {
    const { t } = this.context;
    const { handleSubmit, submitting } = this.props;
    const { SUPPORT_EMAIL } = constants;
    const supportEmailLink = `mailto:${SUPPORT_EMAIL}`;
    

    return (
      <div className={style.container}>
        <Container>
          <h1 className={style.heading}>{t('Password reset')}</h1>
          <Link className={style.loginLink} to={'/'}>{t('cancel')}</Link>
          <form className={style.passwordResetRequestForm} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              component={InputWithLabel}
              disabled={submitting}
              name="email"
              label={t('Email')}
              required
            />
            <p>
              {t('We will send you an email containing a link to reset your password. If you have not received an email, yet, please contact us at {supportEmail}',
              { supportEmail: <a href={supportEmailLink}>{SUPPORT_EMAIL}</a> })}
              
            </p>
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

PasswordResetRequest.propTypes = {
  ...propTypes,
  passwordResetRequest: PropTypes.func.isRequired,
};

PasswordResetRequest.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { email } = values;

  if (!email) {
    errors.email = translatedFormError('required');
  } else if (!email.match(/\S+@\S+\.\S+/)) {
    errors.email = translatedFormError('notAnEmail');
  }
  return errors;
};

export default reduxForm({
  form: 'passwordResetRequestForm',
  validate,
})(PasswordResetRequest);
