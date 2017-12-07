import React from 'react';
import PropTypes from 'prop-types';

import Brand from './brand';
import FaIcon from '../../shared/fa-icon';

import style from './style.scss';

function Footer(props, context) {
  const { t } = context;

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.info}>
          <a className={style.appcampsLink} href="https://www.appcamps.de/">
            {t('With {love} from {brand}', {
              love: (
                <span className={style.love}>
                  <FaIcon icon="heart" />
                </span>
              ),
              brand: (
                <span className={style.link}>App Camps</span>
              ),
            })}
          </a>
        </div>
        <div className={style.share}>
          <a href="https://www.appcamps.de/imprint">{t('Imprint')}</a> -{ ' ' }
          <a href="https://www.appcamps.de/privacypolicy">{t('Privacy Policy')}</a>
          <Brand brand="facebook" name={t('facebook')} />
          <Brand brand="twitter" name={t('twitter')} />
        </div>
      </div>
    </footer>
  );
}

Footer.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Footer;
