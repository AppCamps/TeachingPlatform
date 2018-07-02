import React from 'react';
import PropTypes from 'prop-types';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { mount } from 'enzyme';

import { expect } from '../../chai_helper';
import factory from '../../__factories__';

import Registration from '../../../components/registration';

import Error from '../../../components/atoms/a-error';

describe('<Registration />', () => {
  const store = createStore(combineReducers({ form: formReducer }));

  let createUserMock;
  beforeEach(() => {
    createUserMock = jest.fn(() => Promise.resolve({}));
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
    const registrationTree = setupWrapper(<Registration />);
    global.expect(registrationTree).toMatchSnapshot();
  });

  describe('validation', () => {
    it('requires role, firstName, lastName, email, password, passwordConfirmation, referal, privacyPolicyAccepted', () => {
      const wrapper = setupWrapper(<Registration createUser={createUserMock} />);

      wrapper.find('form').simulate('submit');

      const errors = wrapper.find(Error);

      const requiredErrors = errors.slice(0, 7);
      const privacyPolicyAcceptedError = errors.last();

      // remove privacyPolicyAccepted error
      expect(requiredErrors.length).to.equal(7);
      requiredErrors.forEach(error => expect(error).to.have.text('Required'));

      expect(privacyPolicyAcceptedError).to.have.text('You need to confirm our privacy policy');

      expect(createUserMock.mock.calls).to.have.length(0);
    });

    it('requires email to be an email', () => {
      const wrapper = setupWrapper(<Registration />);

      changeInput(wrapper, 'email', 'testasd');
      wrapper.find('form').simulate('submit');

      let error = findError(wrapper, 'email');

      expect(error.length).to.equal(1);
      expect(error).to.have.text('Not an email');

      changeInput(wrapper, 'email', 'some@email.de');
      wrapper.find('form').simulate('submit');
      error = findError(wrapper, 'email');
      expect(error.length).to.equal(0);
    });

    it('requires password to have at least 8 chars', () => {
      const wrapper = setupWrapper(<Registration />);

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
      const wrapper = setupWrapper(<Registration />);

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


  describe('newsletters', () => {
    it('shows parent newsletter form for role parent', () => {
      const wrapper = setupWrapper(<Registration selectedRole="parent" />);
      global.expect(wrapper.find('#mc_embed_signup')).toMatchSnapshot();
    });

    it('shows parent newsletter form for role student', () => {
      const wrapper = setupWrapper(<Registration selectedRole="student" />);
      global.expect(wrapper.find('#mc_embed_signup')).toMatchSnapshot();
    });
  });
});
