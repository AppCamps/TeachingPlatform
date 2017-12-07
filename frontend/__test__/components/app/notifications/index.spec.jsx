import React from 'react';
import { shallow } from 'enzyme';

import Notifications from '../../../../components/app/notifications';

describe('<Notifcations />', () => {
  it('renders notifications', () => {
    const activeNotifications = [
      {
        type: 'failure',
        text: 'Something failed.',
        key: 1234567,
      },
      {
        type: 'success',
        text: 'Yay!',
        key: 7654321,
      },
    ];

    const notifTree = shallow(<Notifications activeNotifications={activeNotifications} />);
    global.expect(notifTree).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const activeNotifications = [];

    const notifTree = shallow(<Notifications activeNotifications={activeNotifications} />);
    global.expect(notifTree).toMatchSnapshot();
  });
});
