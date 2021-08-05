import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

import style from './style.scss';

const PlatformTips = (_props, { t }) => (
  <div className={style.container}>
    <h1>{t('Tips for the usage of the platform')}</h1>
    <div className={style.contentContainer}>
      <p className={style.question}>
        {t(
          'Are you new here or would you like to know how can you optimally work with the platform and the documents?',
        )}
      </p>
      <div>
        <p>
          {t('In the video, we introduce the platform and give some usage tips')}:
        </p>
        <div className={style.videoContainer}>
          <ReactPlayer
            url="https://player.vimeo.com/video/505620123"
            width="100%"
            height="534px"
          />
        </div>
        <p>
          <a
            href="https://drive.google.com/open?id=0BzMVvLOySsXMZGhhUjFVVXJpR3c"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Do you prefer to read? Here you can find the PDF')}{' '}
            <span className={style.mediaInfo}>({t('please, click')})</span>.
          </a>
        </p>
      </div>
    </div>
  </div>
);

PlatformTips.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default PlatformTips;
