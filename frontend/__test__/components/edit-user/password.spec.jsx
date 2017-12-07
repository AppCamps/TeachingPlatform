import React from 'react';
import PropTypes from 'prop-types';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import pick from 'lodash.pick';

import { mount } from 'enzyme';

import { expect } from '../../chai_helper';
import factory from '../../__factories__';

import EditUserPassword from '../../../components/edit-user/password';

import Error from '../../../components/atoms/a-error';

describe('<EditUserPassword />', () => {
  const store = createStore(combineReducers({ form: formReducer }));

  let updateUserMock;
  beforeEach(() => {
    updateUserMock = jest.fn(() => Promise.resolve({}));
  });

  const user = factory.build('user');

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
    const registrationTree = setupWrapper(
      <EditUserPassword />);
    global.expect(registrationTree).toMatchSnapshot();
  });

  describe('validation', () => {
    it('requires currentPassword, password, passwordConfirmation', () => {
      const wrapper = setupWrapper(<EditUserPassword updateUser={updateUserMock} />);

      wrapper.find('form').simulate('submit');

      const errors = wrapper.find(Error);

      expect(errors.length).to.equal(3);
      errors.forEach(error => expect(error).to.have.text('Required'));

      expect(updateUserMock.mock.calls).to.have.length(0);
    });

    it('requires password to have at least 8 chars', () => {
      const wrapper = setupWrapper(<EditUserPassword />);

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
      const wrapper = setupWrapper(<EditUserPassword />);

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
    const updateUser = () => {
      const promise = new Promise(() => Promise.resolve());
      setTimeout(() => promise.resolve({}), 10);
      return promise;
    };
    const wrapper = setupWrapper(
      <EditUserPassword
        user={user}
        updateUser={updateUser}
      />,
    );

    const userInput = pick(
      factory.build('registration', { currentPassword: 'asdasdasd' }),
      ['currentPassword', 'password', 'passwordConfirmation'],
    );

    Object.keys(userInput).forEach((key) => {
      changeInput(wrapper, key, userInput[key]);
    });

    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Button').prop('disabled')).to.equal(true);
  });
});
