import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import Link from '../shared/link';
import ClassForm from '../shared/class-form';

import { Shape as ClassShape } from '../../models/class';

import style from './style.scss';

class EditClass extends Component {
  constructor() {
    super();
    this.state = {
      didSetInitialValue: false,
      isDirty: false,
      isSubmitted: false,
    };
  }

  componentWillMount() {
    const { fetchCourses, fetchClassById, klass } = this.props;
    fetchClassById(klass.id);
    fetchCourses();
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => this.routerWillLeave());
  }

  componentWillUpdate({ klass, initializeForm }, { didSetInitialValue }) {
    if (!klass.isPersisted || didSetInitialValue) {
      return;
    }

    this.setState({ didSetInitialValue: true });
    initializeForm(klass);
  }

  componentWillUnmount() {
    this.props.destroyForm();
  }

  @autobind
  onDataChanged() {
    this.setState({
      ...this.state,
      isDirty: true,
    });
  }

  @autobind
  async handleSubmit(formValues) {
    const { updateClass, klass } = this.props;
    try {
      // The updateClass promise resolves after the change page action
      // is called. It is necessary to change the state before and
      // revert it if the promise rejects.
      this.setState({
        ...this.state,
        isSubmitted: true,
      });
      await updateClass(klass.id, formValues);
    } catch (e) {
      // Did not submit successfully
      this.setState({
        ...this.state,
        isSubmitted: false,
      });
    }
  }

  routerWillLeave() {
    const { t } = this.context;

    if (this.state.isDirty && !this.state.isSubmitted) {
      return `${t('You did not save your changes! Do you still want to leave the page?')}\n${t('(You can save in the third step, please scroll down.)')}`;
    }

    return null;
  }

  render() {
    const { t } = this.context;

    const formProps = {
      formValues: this.props.formValues,
      topics: this.props.topics,
      handleSubmit: this.handleSubmit,
      submitText: t('Save'),
      onDataChanged: this.onDataChanged,
      editMode: true,
    };

    return (
      <div className={style.container}>
        <div className={style.editClass}>
          <h1 className={style.heading}>
            {t('Edit class')}
          </h1>
          <div className={style.cancel}>
            <Link to="/classes">
              {t('cancel')}
            </Link>
          </div>
          <ClassForm {...formProps} />
        </div>
      </div>
    );
  }
}

EditClass.propTypes = {
  fetchClassById: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
  initializeForm: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  updateClass: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  klass: ClassShape.isRequired,
  topics: PropTypes.arrayOf(ClassShape).isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

EditClass.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default EditClass;
