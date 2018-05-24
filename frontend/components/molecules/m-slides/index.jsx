import React from 'react';
import PropTypes from 'prop-types';

import IFrame from '../../atoms/a-iframe';

import style from './style.scss';

export default function Slides({ deck }) {
  const src = `//appcamps.slides.com/appcamps/${deck}/embed?byline=hidden&share=hidden`;
  const width = 960;
  const height = 600;

  return (
    <div className={style.iframeContainer}>
      <IFrame
        src={src}
        width={width}
        height={height}
      />
    </div>
  );
}

Slides.propTypes = {
  deck: PropTypes.string.isRequired,
};
