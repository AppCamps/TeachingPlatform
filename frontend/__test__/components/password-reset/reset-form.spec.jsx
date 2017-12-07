import React from 'react';
import PropTypes from 'prop-types';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { mount } from 'enzyme';

import { expect } from '../../chai_helper';

import PasswordReset from '../../../components/password-reset/reset-form';

import Error from '../../../components/atoms/a-error';

describe('<ResetForm />', () => {
  const store = createStore(combineReducers({ form: formReducer }));

  let passwordResetMock;
  beforeEach(() => {
    passwordResetMock = jest.fn(() => Promise.resolve({}));
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

  const findErrorForName = name => n => n.prop('for') === name;
  const findError = (wrapper, name) => wrapper.find(Error).findWhere(findErrorForName(name));
  const changeInput = (wrapper, name, value) => {
    let input = wrapper.find(`input[name="${name}"]`);
    if (input.first().prop('type') === 'radio') {
      input = input.find(`[value="${value}"]`);
      if (input.length === 0) { throw `Could not find radio[name=${name} value=${value}]`; }
    }
    input.simulate('change', { target: { value } });
  };

  it('renders form correctly', () => {
    const registrationTree = setupWrapper(<PasswordReset />);
    global.expect(registrationTree).toMatchSnapshot();
  });

  describe('validation', () => {
    it('requires password and passwordConfirmation', () => {
      const wrapper = setupWrapper(<PasswordReset />);

      wrapper.find('form').simulate('submit');

      expect(findError(wrapper, 'password')).to.have.text('Required');
      expect(findError(wrapper, 'passwordConfirmation')).to.have.text('Required');

      expect(passwordResetMock.mock.calls).to.have.length(0);
    });

    it('requires password to have at least 8 chars', () => {
      const wrapper = setupWrapper(<PasswordReset />);

      changeInput(wrapper, 'password', '12345');
      wrapper.find('form').simulate('submit');

      let error = findError(wrapper, 'password');

      expect(error.length).to.equal(1);
      expect(error).to.have.text('At least 8 chars');

      changeInput(wrapper, 'password', '12345678');
      wrapper.find('form').simulate('submit');

      error = findError(wrapper, 'password');
      expect(error.length).to.equal(0);
    });

    it('requires passwordConfirmation to match password', () => {
      const wrapper = setupWrapper(<PasswordReset passwordReset={passwordResetMock} />);

      changeInput(wrapper, 'password', '12345678');
      changeInput(wrapper, 'passwordConfirmation', 'notEqual');
      wrapper.find('form').simulate('submit');

      let error = findError(wrapper, 'passwordConfirmation');

      expect(error.length).to.equal(1);
      expect(error).to.have.text('Not equal');

      changeInput(wrapper, 'passwordConfirmation', '12345678');
      wrapper.find('form').simulate('submit');

      error = findError(wrapper, 'passwordConfirmation');
      expect(error.length).to.equal(0);
    });
  });

  it('disables submit button while submitting', () => {
    const passwordReset = () => {
      const promise = new Promise(() => Promise.resolve());
      setTimeout(() => promise.resolve({}), 10);
      return promise;
    };
    const wrapper = setupWrapper(
      <PasswordReset
        passwordReset={passwordReset}
      />,
    );

    changeInput(wrapper, 'password', 'password');
    changeInput(wrapper, 'passwordConfirmation', 'password');

    wrapper.find('form').simulate('submit');
    expect(wrapper.find('button').prop('disabled')).to.equal(true);
  });
});
