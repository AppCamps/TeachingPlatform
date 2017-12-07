import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes as formPropTypes } from 'redux-form';
import autobind from 'autobind-decorator';

import { constants } from '../../config';
import { translatedFormError } from '../../utils/translations';

import Link from '../shared/link';
import InputWithLabel from '../shared/input-with-label';
import TextareaWithLabel from '../shared/textarea-with-label';
import RadioWithLabel from '../shared/radio-with-label';
import CheckboxWithLabel from '../shared/checkbox-with-label';
import Label from '../shared/label';
import Button from '../shared/button';
import Spinner from '../shared/spinner';

import NewsletterForm from './newsletters';

import style from './style.scss';

const { SUPPORT_EMAIL, WWW_URL } = constants;

class Registration extends Component {
  @autobind
  onSubmit(formValues) {
    const { createUser } = this.props;
    return createUser(formValues);
  }

  registrationForm() {
    const { t } = this.context;
    const { selectedRole, submitting } = this.props;
    const privacyPolicyUrl = `${WWW_URL}/privacypolicy`;

    if (['parent', 'student'].includes(selectedRole)) {
      return null;
    }

    return (
      <div>
        <div>
          <div className={style.firstName}>
            <Field name="firstName" label={t('First name')} component={InputWithLabel} required />
          </div>
          <div className={style.lastName}>
            <Field name="lastName" label={t('Last name')} component={InputWithLabel} required />
          </div>
        </div>
        <div>
          <div className={style.email}>
            <Field name="email" label={t('Email')} component={InputWithLabel} required />
          </div>
          <div className={style.password}>
            <Field
              name="password"
              label={t('Password')}
              type="password"
              component={InputWithLabel}
              required
            />
          </div>
          <div className={style.passwordConfirmation}>
            <Field
              name="passwordConfirmation"
              label={t('Password confirmation')}
              type="password"
              component={InputWithLabel}
              required
            />
          </div>
        </div>
        <div>
          <div className={style.referal}>
            <Field
              name="referal"
              label={t('How did you hear from us?')}
              component={InputWithLabel}
              required
            />
          </div>
        </div>
        <div>
          <div className={style.comment}>
            <Field name="comment" label={t('Comment')} component={TextareaWithLabel} />
          </div>
        </div>
        <div>
          <div className={style.additionalTerms}>
            <Label text={t('By registrating I accept the following terms:')} />
            <ul>
              <li>
                {t(
                  'I will not forward any data or teaching materials to third parties. My colleagues may register themselves on interest.',
                )}
              </li>
              <li>
                {t(
                  'I accept to receive our newsletter per email (e.g notifications about new teaching materials). You may revoke this any time by clicking the provided links in the email or by sending an email to {email}.',
                  { email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> },
                )}
              </li>
              <li>
                {t(
                  'I will answer questionnaires to evaluate the quality of our teaching materials. Before and after the execution of every course there will be short questionnaires (approx. 5 minutes). To be able to provide our platform for free we need to collect metrics to prove that our teaching materials are working.',
                )}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className={style.privacyPolicy}>
            <Field
              name="privacyPolicyAccepted"
              label={t('Data protection')}
              component={CheckboxWithLabel}
              checkboxLabel={t('I have read and accept the {privacyPolicy} of App Camps.', {
                privacyPolicy: (
                  <a rel="noopener noreferrer" target="_blank" href={privacyPolicyUrl}>
                    {t('Privacy Policy')}
                  </a>
                ),
              })}
              checkboxClassName={style.privacyPolicyOption}
              required
            />
          </div>
        </div>
        <div className={style.actions}>
          <div className={style.nextButton}>
            <Spinner visible={submitting} />
            <Button isAction disabled={submitting} type="submit">
              {t('Sign up free of charge')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  newsletterSignup() {
    const { t } = this.context;
    const { selectedRole } = this.props;

    // t('student')
    if (selectedRole === 'student') {
      return (
        <NewsletterForm
          newsletterId="1ee76dbe06"
          hiddenInputName="b_9d7b8b6d7aa268c425ae6e5cf_1ee76dbe06"
          resourceName={t(selectedRole)}
        >
          {t(
            'We are sorry, but this platform was built with teachers and course instructors in mind. Nonetheless we provide a newsletter for students like you, where we will keep you informed about programming, computer science and technology.',
          )}
        </NewsletterForm>
      );
      // t('parent')
    } else if (selectedRole === 'parent') {
      return (
        <NewsletterForm
          newsletterId="c69631ed57"
          hiddenInputName="b_9d7b8b6d7aa268c425ae6e5cf_c69631ed57"
          resourceName={t(selectedRole)}
        >
          {t(
            'We are sorry, but this platform was built with teachers and course instructors in mind. Nonetheless we provide a newsletter for parents, where we will keep you informed about programming, computer science and technology.',
          )}
        </NewsletterForm>
      );
    }

    return null;
  }

  render() {
    const { t } = this.context;

    const signInPath = '/login';
    const roleOptions = [
      { label: t('Teacher'), value: 'role_teacher' },
      { label: t('Course instructor'), value: 'role_course_instructor' },
      { label: t('Parent'), value: 'parent' },
      { label: t('Student'), value: 'student' },
    ];

    return (
      <div className={style.container}>
        <div className={style.registration}>
          <h1 className={style.heading}>{t('Please sign up for free access')}</h1>
          <div className={style.signInLink}>
            {t('Already registered? {signIn}', {
              signIn: <Link to={signInPath}>{t('Sign in')}</Link>,
            })}
          </div>
          <div className={style.registrationForm}>
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <div>
                <div className={style.role}>
                  <Field
                    name="role"
                    label={t('I am a')}
                    component={RadioWithLabel}
                    options={roleOptions}
                    optionClassName={style.roleOption}
                    autoFocus
                    required
                  />
                </div>
              </div>
              {this.registrationForm()}
            </form>
            {this.newsletterSignup()}
          </div>
        </div>
      </div>
    );
  }
}

Registration.propTypes = {
  ...formPropTypes,
};

Registration.contextTypes = {
  t: PropTypes.func.isRequired,
};

const validate = (values) => {
  const errors = {};
  const { email, password, passwordConfirmation, privacyPolicyAccepted } = values;

  [
    'role',
    'firstName',
    'lastName',
    'email',
    'password',
    'passwordConfirmation',
    'referal',
  ].forEach((key) => {
    if (!values[key]) {
      errors[key] = translatedFormError('required');
    }
  });

  if (email && !email.match(/\S+@\S+\.\S+/)) {
    errors.email = translatedFormError('notAnEmail');
  }

  if (password && password.length < 8) {
    errors.password = translatedFormError('minimumCharCount', { min: 8 });
  }

  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = translatedFormError('notEqual');
  }

  if (!privacyPolicyAccepted) {
    errors.privacyPolicyAccepted = translatedFormError('privacyPolicyNotAccepted');
  }

  return errors;
};

export default reduxForm({
  form: 'registration',
  validate,
})(Registration);
