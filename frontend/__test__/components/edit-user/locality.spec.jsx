import React from 'react';
import PropTypes from 'prop-types';

import { shallow, mount } from 'enzyme';

import { expect } from '../../chai_helper';

import EditLocality, { __RewireAPI__ } from '../../../components/edit-user/locality';

import { user } from '../../fixtures/api/createUser';

function LocalityForm() { return <form />; }

describe('<EditLocality />', () => {
  beforeEach(() => {
    __RewireAPI__.__Rewire__('LocalityForm', LocalityForm);
  });

  it('renders includes', () => {
    const wrapper = shallow(
      <EditLocality user={user} />,
      { context: { t: t => t } },
      { childContextTypes: { t: PropTypes.func } },
    );
    global.expect(wrapper).toMatchSnapshot();
  });

  it('includes LocalityForm and forwards all props', () => {
    const wrapper = mount(
      <EditLocality user={user} />,
      { context: { t: t => t } },
      { childContextTypes: { t: PropTypes.func } },
    );
    expect(wrapper.find(LocalityForm)).to.have.props(wrapper.props());
  });
});
