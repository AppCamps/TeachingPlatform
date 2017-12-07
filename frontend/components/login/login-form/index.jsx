import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes } from 'redux-form';
import { Link } from 'react-router';
import autobind from 'autobind-decorator';

import { translatedFormError } from '../../../utils/translations';

import Container from '../../shared/container';
import Button from '../../shared/button';
import Error from '../../atoms/a-error';
import Spinner from '../../shared/spinner';
import InputWithLabel from '../../shared/input-with-label';


import style from './style.scss';

class LoginForm extends Component {

  @autobind
  onSubmit(formData) {
    const { loginUser } = this.props;
    return loginUser(formData);
  }

  handleEmailConfirmationRequestLinkClick(email) {
    const { emailConfirmationRequest } = this.props;
    return emailConfirmationRequest({ email });
  }

  errorMessage() {
    const { t } = this.context;
    const { authenticationError } = this.props;

    if (!authenticationError) {
      return null;
    }

    const errorCodes = {
      invalid_email_or_password: t('Invalid email or password'),
      session_expired: t('Your session has expired'),
      email_unconfirmed: t('Unconfirmed email.'),
    };

    const errorMessage = errorCodes[authenticationError.code] || authenticationError.title;
    let errorAction = null;
    if (authenticationError.code === 'email_unconfirmed') {
      errorAction = (
        <a
          tabIndex="0"
          role="button"
          onClick={() => this.handleEmailConfirmationRequestLinkClick(authenticationError.email)}
        >
          {t('Resend confirmation link')}
        </a>
      );
    }

    return (
      <span className={style.loginError}>
        <Error>{errorMessage}<br />{errorAction}</Error>
      </span>
    );
  }

  renderRegistrationLink() {
    const { t } = this.context;
    const registrationPath = '/registration';
    const confirmationPath = '/email-confirmation';

    return (
      <div className={style.links}>
        <div>
          {t('Did not sign up yet? {registrationLink}', {
            registrationLink: <Link to={registrationPath}>{t('Register here')}</Link>,
          })}
        </div>
        <div>
          {t('Did not receive a confirmation email? {confirmationLink}', {
            confirmationLink: <Link to={confirmationPath}>{t('Click here')}</Link>,
          })}
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.context;
    const { handleSubmit, submitting } = this.props;
    const isAuthenticating = submitting;
    const passwordResetLink = '/password-reset';

    return (
      <div className={style.container}>
        <Container>
          <h1 className={style.heading}>{t('Login')}</h1>
          <Link className={style.forgotPassword} to={passwordResetLink}>{t('Forgot your password?')}</Link>
          <form className={style.loginForm} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              component={InputWithLabel}
              disabled={isAuthenticating}
              name="email"
              label={t('Email')}
              required
            />
            <Field
              component={InputWithLabel}
              disabled={isAuthenticating}
              name="password"
              label={t('Password')}
              type="password"
              required
            />
            <div className={style.actions}>
              {this.errorMessage()}
              <span className={style.submit}>
                <Spinner visible={isAuthenticating} />
                <Button isAction type="submit" disabled={isAuthenticating} rightIcon="angle-right">
                  {t('Send')}
                </Button>
              </span>
            </div>
          </form>
        </Container>
        {this.renderRegistrationLink()}
      </div>
    );
  }
}

LoginForm.propTypes = {
  ...propTypes,
  loginUser: PropTypes.func.isRequired,
  emailConfirmationRequest: PropTypes.func.isRequired,
  error: PropTypes.shape({
    code: PropTypes.string,
    title: PropTypes.string,
  }),
};

LoginForm.defaultProps = {
  error: null,
};

LoginForm.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const email = values.email;
  const password = values.password;

  if (!email) {
    errors.email = translatedFormError('required');
  } else if (!email.match(/\S+@\S+\.\S+/)) {
    errors.email = translatedFormError('notAnEmail');
  }
  if (!password) {
    errors.password = translatedFormError('required');
  }
  return errors;
};

export default reduxForm({
  form: 'login',
  validate,
})(LoginForm);
