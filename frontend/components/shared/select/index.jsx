import React from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable } from 'react-select';

import style from './style.scss';

function WrappedSelect(props, context) {
  const { t } = context;

  const className = (props.hasError) ? style.error : '';

  const defaultTexts = {
    clearAllText: t('Clear all'),
    clearValueText: t('Clear'),
    addLabelText: t('Add label'),
    noResultsText: t('No results found'),
    placeholder: t('Please select'),
    searchPromptText: t('Type to search'),
    promptTextCreator: label => t('Add {label}', { label }),
  };

  // Move priority options to the top of the list
  const priorityOptions = [];
  const normalOptions = [];
  props.options.forEach((option) => {
    if (props.priority.indexOf(option.value) !== -1) {
      priorityOptions.push(option);
    } else {
      normalOptions.push(option);
    }
  });
  // Guarantee the sorting defined in the priority array
  priorityOptions.sort((opt1, opt2) => {
    const opt1Index = props.priority.indexOf(opt1.value);
    const opt2Index = props.priority.indexOf(opt2.value);
    return opt1Index - opt2Index;
  });

  const Component = (props.creatable) ? Creatable : Select;
  return (
    <Component
      className={className}
      {...defaultTexts}
      {...props}
      options={[...priorityOptions, ...normalOptions]}
    />
  );
}

WrappedSelect.contextTypes = {
  t: PropTypes.func.isRequired,
};
WrappedSelect.propTypes = {
  clearable: PropTypes.bool,
  creatable: PropTypes.bool,
  hasError: PropTypes.bool,
  options: PropTypes.array,
  priority: PropTypes.array,
};

WrappedSelect.defaultProps = {
  clearable: false,
  creatable: false,
  hasError: false,
  options: [],
  priority: [],
};

export default WrappedSelect;
