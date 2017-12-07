import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FaIcon from '../../../shared/fa-icon';

import style from './style.scss';

class Brand extends Component {
  href() {
    if (this.props.brand === 'facebook') {
      return 'https://www.facebook.com/AppCamps';
    } else if (this.props.brand === 'twitter') {
      return 'https://twitter.com/app_camps';
    }
    return null;
  }

  render() {
    const { t } = this.context;
    const { brand, name } = this.props;
    return (
      <a className={style.brand} href={this.href()} rel="noopener noreferrer" target="_blank" title={t('Appcamps on {name}', { name })}>
        <FaIcon icon={brand} />
      </a>
    );
  }
}

Brand.propTypes = {
  brand: PropTypes.oneOf(['facebook', 'twitter']).isRequired,
  name: PropTypes.string.isRequired,
};

Brand.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Brand;
