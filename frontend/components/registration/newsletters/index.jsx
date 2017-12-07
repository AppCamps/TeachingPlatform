import React from 'react';
import PropTypes from 'prop-types';

import InputWithLabel from '../../shared/input-with-label';
import Button from '../../shared/button';

import style from './style.scss';

function StudentNewsletter(props, context) {
  const { t } = context;
  return (
    <div id="mc_embed_signup">
      <h2 className={style.heading}>{t('Thank you for you interest in App Camps')}</h2>
      <div className={style.info}>
        {props.children}
      </div>
      <h2>{t('Subscribe to our {resourceName} newsletter', { resourceName: props.resourceName })}</h2>
      <form action={`//appcamps.us9.list-manage.com/subscribe/post?u=9d7b8b6d7aa268c425ae6e5cf&id=${props.newsletterId}`} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
        <div className={style.email}>
          <InputWithLabel
            type="email"
            name="EMAIL"
            label={t('Email')}
            required
          />
        </div>
        <div className={style.firstName}>
          <InputWithLabel
            type="text"
            name="FNAME"
            label={t('First name')}
            required
          />
        </div>
        <div className={style.lastName}>
          <InputWithLabel
            type="text"
            name="LNAME"
            label={t('Last name')}
            required
          />
        </div>
        <div className={style.subscribe}>
          <Button isAction isFullWidth value="Subscribe" name="subscribe" type="submit" rightIcon="envelope-o">
            {t('Subscribe')}
          </Button>
        </div>
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <input type="text" name={props.hiddenInputName} tabIndex="-1" value="" />
        </div>
      </form>
    </div>
  );
}

StudentNewsletter.propTypes = {
  children: PropTypes.node,
  hiddenInputName: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  newsletterId: PropTypes.string.isRequired,
};

StudentNewsletter.defaultProps = {
  children: null,
};

StudentNewsletter.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default StudentNewsletter;
