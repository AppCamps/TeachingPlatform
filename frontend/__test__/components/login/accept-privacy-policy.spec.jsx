import React from 'react';
import { shallow, mount } from 'enzyme';

import { expect } from '../../chai_helper';

import AcceptPrivacyPolicy from '../../../components/login/accept-privacy-policy';

import UserRecord from '../../../models/user';

import Button from '../../../components/shared/button';

describe('<AcceptPrivacyPolicy />', () => {
  const user = new UserRecord({
    isAuthenticated: true,
    privacyPolicyAccepted: false,
  });
  let declinePrivacyPolicyCallCount;
  const declinePrivacyPolicy = () => { declinePrivacyPolicyCallCount += 1; };

  const acceptPrivacyPolicyArguments = [];
  const acceptPrivacyPolicy = (...args) => {
    acceptPrivacyPolicyArguments.push(args);
    return new Promise(() => {});
  };

  const defaultProps = {
    declinePrivacyPolicy,
    acceptPrivacyPolicy,
    user,
  };

  beforeEach(() => {
    declinePrivacyPolicyCallCount = 0;
    acceptPrivacyPolicyArguments.length = 0;
  });

  it('has 2 buttons', () => {
    const wrapper = shallow(<AcceptPrivacyPolicy {...defaultProps} />);

    expect(wrapper.find(Button)).to.have.length(2);
  });

  it('calls declinePrivacyPolicy on decline', () => {
    const wrapper = mount(<AcceptPrivacyPolicy {...defaultProps} />);

    const declineButton = wrapper.find(Button).at(0);
    expect(declineButton).to.have.text('Datenschutzbestimmungen ablehnen');

    declineButton.simulate('click');

    expect(declinePrivacyPolicyCallCount).to.equal(1);
  });

  it('calls acceptPrivacyPolicy on accept', () => {
    const wrapper = mount(<AcceptPrivacyPolicy {...defaultProps} />);

    const acceptButton = wrapper.find(Button).at(1);
    expect(acceptButton).to.have.text('Datenschutzbestimmungen annehmen');

    acceptButton.simulate('click');

    expect(acceptPrivacyPolicyArguments[0]).to.deep.eql([user]);
    expect(acceptPrivacyPolicyArguments.length).to.equal(1);

    wrapper.find('button').forEach(button => expect(button.prop('disabled')).to.equal(true));
  });
});
