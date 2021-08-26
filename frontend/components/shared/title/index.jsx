import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style.scss';

function Title(props) {
  const { primary, children, tag, color } = props;

  const CustomTag = tag || 'span';

  const titleContainerClassNames = classNames({
    [style.titleContainer]: true,
    [style.titleContainerPrimary]: primary,
  });
  const titleClassNames = classNames({
    [style.title]: true,
    [style.titlePrimary]: primary,
  });

  const customStyle = {
    color,
    borderColor: color,
  };

  return (
    <div className={titleContainerClassNames} style={customStyle}>
      <CustomTag className={titleClassNames}>
        {children}
      </CustomTag>
    </div>
  );
}

Title.defaultProps = {
  primary: false,
  tag: 'span',
  color: style.colorBlack,
};

Title.propTypes = {
  children: PropTypes.node.isRequired,
  primary: PropTypes.bool,
  tag: PropTypes.string,
  color: PropTypes.string,
};

export default Title;
