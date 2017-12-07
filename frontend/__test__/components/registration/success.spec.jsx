import React from 'react';
import PropTypes from 'prop-types';

import { mount } from 'enzyme';

import { expect } from '../../chai_helper';

import { t } from '../../../utils/translations';

import RegistrationSuccess from '../../../components/registration/success';

describe('<Registration />', () => {
  let redirectToRegistrationPageMock;
  beforeEach(() => {
    redirectToRegistrationPageMock = jest.fn();
  });

  const setupWrapper = props => (
    mount(
      <RegistrationSuccess
        {...{
          redirectToRegistrationPage: redirectToRegistrationPageMock,
          ...props,
        }}
      />,
      {
        context: {
          t,
        },
        childContextTypes: { t: PropTypes.func },
      },
    )
  );

  it('renders correctly with user firstName', () => {
    const wrapper = setupWrapper({ firstName: 'Thomas' });

    expect(wrapper).to.contain.text('Thomas');
    global.expect(wrapper).toMatchSnapshot();
  });

  it('redirects to Registration and renders nothing if no user is given', () => {
    const wrapper = setupWrapper({ firstName: null });

    expect(wrapper.children()).to.have.length(0);
    expect(redirectToRegistrationPageMock.mock.calls).to.have.length(1);
  });
});
