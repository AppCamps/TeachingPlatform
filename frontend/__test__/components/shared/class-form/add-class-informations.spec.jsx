import React from 'react';
import PropTypes from 'prop-types';

import { createStore, combineReducers } from 'redux';
import { Field, reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';

import { mount } from 'enzyme';
import { expect } from '../../../chai_helper';

import AddClassInformations, {
  validate,
  __RewireAPI__ as RewireAPI,
} from '../../../../components/shared/class-form/add-class-informations';

import InputWithLabel from '../../../../components/shared/input-with-label';
import SelectWithLabel from '../../../../components/shared/select-with-label';
import Button from '../../../../components/shared/button';

import style from '../../../../components/shared/class-form/add-class-informations/style.scss';

const MONTH_AUGUST = 7; // JS month ranges from 0 - 11

describe('<AddClassInformations />', () => {
  let onSubmitCallCount = 0;
  const onSubmit = () => {
    onSubmitCallCount += 1;
  };

  let previousPageCallCount = 0;
  const previousPage = () => {
    previousPageCallCount += 1;
  };

  const formValues = {};
  const defaultProps = {
    onSubmit,
    previousPage,
    formValues,
  };
  const store = createStore(combineReducers({ form: formReducer }));

  const wrapComponent = component => <Provider store={store}>{component}</Provider>;

  let parent = null;
  const setupWrapper = (props = {}) => {
    const component = wrapComponent(
      <AddClassInformations {...Object.assign({}, defaultProps, props)} />,
    );
    parent = mount(component, {
      context: {
        t(translation) {
          return translation;
        },
      },
      childContextTypes: { t: PropTypes.func },
    });
    return parent.find(AddClassInformations);
  };

  beforeEach(() => {
    onSubmitCallCount = 0;
    previousPageCallCount = 0;
  });

  it('renders all fields and buttons', () => {
    const isInRange0To999 = jest.fn();
    const isInRange = () => isInRange0To999;
    RewireAPI.__Rewire__('isInRange', isInRange);

    const wrapper = setupWrapper();
    RewireAPI.__ResetDependency__('isInRange');

    expect(
      wrapper.containsMatchingElement(
        <Field name="className" label="Class name" component={InputWithLabel} required />,
      ),
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field name="schoolYear" label="School year" component={InputWithLabel} required />,
      ),
    ).to.be.true;

    expect(
      wrapper.containsMatchingElement(
        <Field name="grade" label="Grade" component={InputWithLabel} />,
      ),
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="girlCount"
          label="Girl count"
          component={InputWithLabel}
          normalize={isInRange0To999}
        />,
      ),
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="boyCount"
          label="Boy count"
          component={InputWithLabel}
          normalize={isInRange0To999}
        />,
      ),
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="plannedSchoolUsage"
          label="Where will you use the materials?"
          component={SelectWithLabel}
        />,
      ),
    ).to.be.true;
    expect(
      wrapper.containsMatchingElement(
        <Field
          name="schoolSubject"
          label="In which school subject will you use the materials?"
          component={InputWithLabel}
        />,
      ),
    ).to.be.true;

    expect(wrapper.find(Button)).to.have.length(2);

    const buttons = wrapper.find(`.${style.actions}`);
    expect(buttons.childAt(0).find(Button)).to.have.text('Next');
    expect(
      buttons
        .childAt(0)
        .find(Button)
        .prop('type'),
    ).to.equal('submit');
    expect(buttons.childAt(1).find(Button)).to.have.text('Back');
  });

  it('updates schoolSubjectLabel based on plannedSchoolUsage values', () => {
    let wrapper = setupWrapper();

    const schoolSubjectLabel = () => wrapper.find(`.${style.schoolSubject} label`);
    expect(schoolSubjectLabel()).to.have.text(
      'In which school subject will you use the materials?',
    );

    wrapper = setupWrapper({ formValues: { ...formValues, plannedSchoolUsage: 'project_group' } });
    expect(schoolSubjectLabel()).to.have.text('In which project group will you use the materials?');

    wrapper = setupWrapper({ formValues: { ...formValues, plannedSchoolUsage: 'lesson_choice' } });
    expect(schoolSubjectLabel()).to.have.text(
      'In which school subject will you use the materials?',
    );

    wrapper = setupWrapper({ formValues: { ...formValues, plannedSchoolUsage: 'project_days' } });
    expect(schoolSubjectLabel()).to.have.text(
      'In what kind of project will you use the materials?',
    );

    wrapper = setupWrapper({ formValues: { ...formValues, plannedSchoolUsage: 'lesson_duty' } });
    expect(schoolSubjectLabel()).to.have.text(
      'In which school subject will you use the materials?',
    );
  });

  it('prefills schoolYear', () => {
    /**
     * A school year is usually from Sept. until July.
     * E.g. if current date is 03/2017, then the current
     * school year should be 2016/2107
     * */
    const now = new Date();
    const currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    if (currentMonth < MONTH_AUGUST) {
      currentYear -= 1;
    }

    const schoolYear = `${currentYear} / ${currentYear + 1}`;

    const wrapper = setupWrapper();
    const schoolYearInput = wrapper.find(`.${style.schoolYear} input`);

    expect(schoolYearInput.prop('value')).to.equal(schoolYear);
  });

  describe('#validate', () => {
    it('requires className and schoolYear', () => {
      const errors = validate({});

      expect(errors).to.deep.eql({
        className: 'Required',
        schoolYear: 'Required',
      });
    });
  });

  describe('Next Button', () => {
    it('it calls onSubmit for when required fields are filled', () => {
      const wrapper = setupWrapper();

      wrapper.find(`.${style.className} input`).simulate('change', {
        target: { value: 'Klasse 7A' },
      });
      wrapper.find(`.${style.schoolYear} input`).simulate('change', {
        target: { value: '15/16' },
      });

      wrapper.find('form').simulate('submit');

      const state = store.getState().form.classForm.values;
      expect(state.className).to.equal('Klasse 7A');
      expect(state.schoolYear).to.equal('15/16');
      expect(onSubmitCallCount).to.equal(1);
    });
  });

  describe('Back Button', () => {
    it('it calls previousPage on backButton click', () => {
      const wrapper = setupWrapper();

      wrapper.find(`.${style.backButton} button`).simulate('click');

      expect(previousPageCallCount).to.equal(1);
    });
  });
});
