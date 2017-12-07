import React from 'react';
import { shallow } from 'enzyme';

import { expect } from '../../chai_helper';

import CreateClass from '../../../components/create-class';

import Link from '../../../components/shared/link';
import ClassForm from '../../../components/shared/class-form';

import style from '../../../components/create-class/style.scss';

describe('<CreateClass />', () => {
  const defaultProps = {
    fetchCourses: jest.fn(),
    user: { locality: true },
    onDataChanged: () => {},
    router: {
      setRouteLeaveHook: () => {},
    },
    route: {},
  };

  it('calls destroyForm on unmount', () => {
    const destroyForm = jest.fn();

    const wrapper = shallow(<CreateClass {...defaultProps} destroyForm={destroyForm} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(destroyForm.mock.calls.length).to.eql(0);

    wrapper.unmount();

    expect(destroyForm.mock.calls.length).to.eql(1);
  });

  it('renders a cancel link', () => {
    const wrapper = shallow(<CreateClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    const link = wrapper.find(`.${style.cancel}`).find(Link);

    expect(link.prop('to')).to.equal('/classes');
    expect(link.children().first()).to.have.text('cancel');
  });

  it('calls fetchCourses on load', () => {
    const fetchCourses = jest.fn();

    shallow(<CreateClass {...defaultProps} fetchCourses={fetchCourses} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(fetchCourses.mock.calls.length).to.eql(1);
  });

  it('forwards all props to ClassForm', () => {
    const formValues = {};
    const topics = [];

    const wrapper = shallow(
      <CreateClass
        {...defaultProps}
        {...{
          formValues,
          topics,
        }}
      />,
      {
        context: {
          t(translation) {
            return translation;
          },
        },
      },
    );

    const renderedClassForm = wrapper.find(ClassForm);

    expect(renderedClassForm).to.have.prop('formValues', formValues);
    expect(renderedClassForm).to.have.prop('topics', topics);
    expect(renderedClassForm).to.have.prop('submitText', 'Create class');
    expect(renderedClassForm.prop('handleSubmit')).to.be.a('function');
  });
});
