import React from 'react';
import PropTypes from 'prop-types';

import { mount } from 'enzyme';

import Certificate from '../../../../components/shared/course/certificate';

const translationContext = {
  context: {
    t(trans) {
      return trans;
    },
  },
  contextTypes: PropTypes.func.isRequire,
};

describe('<Certificate/>', () => {
  const defaultProps = {
    number: 42,
    color: 'red',
  };

  it('should render isAvailable false state', () => {
    const wrapper = mount(
      <Certificate {...defaultProps} isAvailable={false} />,
      translationContext,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render isAvailable true state', () => {
    const wrapper = mount(<Certificate {...defaultProps} isAvailable />, translationContext);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render isCompleted true state', () => {
    const wrapper = mount(<Certificate {...defaultProps} isCompleted />, translationContext);

    expect(wrapper).toMatchSnapshot();
  });

  it('calls downloadCertificate with courseSchoolClass on click if isAvailable true', () => {
    const downloadCertificate = jest.fn();
    const courseSchoolClass = { certificateDownloaded: true };

    const wrapper = mount(
      <Certificate
        {...defaultProps}
        isAvailable
        courseSchoolClass={courseSchoolClass}
        downloadCertificate={downloadCertificate}
      />,
      translationContext,
    );

    wrapper.find('a[role="button"]').simulate('click');

    expect(downloadCertificate.mock.calls).toHaveLength(1);
    expect(downloadCertificate.mock.calls[0]).toEqual([courseSchoolClass]);
  });
});
