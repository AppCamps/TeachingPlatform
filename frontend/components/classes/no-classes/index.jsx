import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable import/no-webpack-loader-syntax */
import image1 from '!file-loader?name=[name]-[hash].[ext]!./image1.png';
import image2 from '!file-loader?name=[name]-[hash].[ext]!./image2.png';
/* eslint-enable import/no-webpack-loader-syntax */

import style from './style.scss';

export function NoClasses(props, { t }) {
  return (
    <div className={style.noClasses}>
      <p><b>{t('Why to add classes?')}</b></p>
      <p><span className={style.boxedText}><b>{t('Helpful for you:')}</b> {t('you can manage more classes and see their progress.')}</span><img alt="" src={image1} /> <img alt="" src={image2} /></p>
      <p><b>{t('Helpful for us:')}</b> {t('through the existing classes we see how many students we could reach. When we show that we reach many students, we can keep our offer by financing ourselves via funding and providing support also in the future for free.')}</p>
    </div>
  );
}

NoClasses.contextTypes = {
  t: PropTypes.func.isRequired,
};
