import React from 'react';
import PropTypes from 'prop-types';
import { Field, reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { mount } from 'enzyme';

import { expect } from '../../chai_helper';

import LoginForm from '../../../components/login/login-form';
import style from '../../../components/login/login-form/style.scss';

import Button from '../../../components/shared/button';
import Error from '../../../components/atoms/a-error';
import InputWithLabel from '../../../components/shared/input-with-label';

describe('<LoginForm />', () => {
  const redirect = '/courses';
  let loginUserCallCount;
  const loginUser = () => { loginUserCallCount += 1; };

  const store = createStore(combineReducers({ form: formReducer }));

  const defaultProps = {
    redirect,
    loginUser,
  };

  beforeEach(() => {
    loginUserCallCount = 0;
  });

  const setupWrapper = component => (
    mount(
      (
        <Provider store={store}>
          {component}
        </Provider>
      ),
      {
        context: {
          t(translation) { return translation; },
        },
        childContextTypes: { t: PropTypes.func },
      },
    )
  );

  it('renders form', () => {
    const wrapper = setupWrapper(<LoginForm {...defaultProps} />);

    const inputs = wrapper.find(Field);

    expect(inputs.at(0).prop('component')).to.equal(InputWithLabel);
    expect(inputs.at(0).prop('name')).to.equal('email');
    expect(inputs.at(0).prop('label')).to.equal('Email');

    expect(inputs.at(1).prop('component')).to.equal(InputWithLabel);
    expect(inputs.at(1).prop('name')).to.equal('password');
    expect(inputs.at(1).prop('label')).to.equal('Password');

    expect(wrapper.find(Button)).to.have.text('Send');
  });

  it('requires email and password and does not call loginUser', () => {
    const wrapper = setupWrapper(<LoginForm {...defaultProps} />);

    wrapper.find('form').simulate('submit');

    const errors = wrapper.find(Error);

    expect(errors.length).to.equal(2);
    errors.forEach(error => expect(error).to.have.text('Required'));

    expect(loginUserCallCount).to.equal(0);
  });

  it('requires email to be an email', () => {
    const wrapper = setupWrapper(<LoginForm {...defaultProps} />);

    wrapper.find('input[name="email"]').simulate('change', {
      target: { value: 'testasd' },
    });
    wrapper.find('input[name="password"]').simulate('change', {
      target: { value: 'passwd' },
    });

    wrapper.find('form').simulate('submit');

    const error = wrapper.find(Error);

    expect(error.length).to.equal(1);
    expect(error).to.have.text('Not an email');

    expect(loginUserCallCount).to.equal(0);

    wrapper.find('input[name="email"]').simulate('change', {
      target: { value: 'some@email.de' },
    });
    wrapper.find('form').simulate('submit');
    expect(loginUserCallCount).to.equal(1);
  });

  it('requires email and password and does not call loginUser', () => {
    const wrapper = setupWrapper(<LoginForm {...defaultProps} />);

    wrapper.find('input[name="email"]').simulate('change', {
      target: { value: 'test@test.de' },
    });
    wrapper.find('input[name="password"]').simulate('change', {
      target: { value: 'password123' },
    });

    wrapper.find('form').simulate('submit');

    expect(loginUserCallCount).to.equal(1);
  });

  describe('login error', () => {
    it('translates errors for invalid credentials or login expire', () => {
      const invalidPasswordError =
        { code: 'invalid_email_or_password', title: 'invalid_email_or_password' };

      const sessionExpiredError =
        { code: 'session_expired', title: 'session_expired' };

      let wrapper = setupWrapper(
        <LoginForm {...defaultProps} authenticationError={invalidPasswordError} />,
      );

      expect(wrapper.find(`.${style.loginError}`)).to.have.text('Invalid email or password');

      wrapper = setupWrapper(
        <LoginForm {...defaultProps} authenticationError={sessionExpiredError} />,
      );

      expect(wrapper.find(`.${style.loginError}`)).to.have.text('Your session has expired');
    });

    it('shows title for unknown errors', () => {
      const unknownError = { title: 'error' };

      const wrapper = setupWrapper(
        <LoginForm {...defaultProps} authenticationError={unknownError} />,
      );

      expect(wrapper.find(`.${style.loginError}`)).to.have.text('error');
    });

    it('shows nothing without errors', () => {
      const wrapper = setupWrapper(
        <LoginForm {...defaultProps} authenticationError={null} />,
      );

      expect(wrapper.find(`.${style.loginError}`)).to.have.length(0);
    });
  });

  it('disables inputs and buttons while submitting', () => {
    const promise = new Promise(() => {});
    const wrapper = setupWrapper(
      <LoginForm
        {...defaultProps}
        loginUser={() => promise}
      />);

    wrapper.find('input[name="email"]').simulate('change', {
      target: { value: 'test@test.de' },
    });
    wrapper.find('input[name="password"]').simulate('change', {
      target: { value: 'password123' },
    });

    wrapper.find('form').simulate('submit');

    wrapper.find('input').forEach(input => expect(input.prop('disabled')).to.equal(true));
    expect(wrapper.find('button').prop('disabled')).to.equal(true);
  });
});
