import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../shared/spinner';

import style from './style.scss';

class EmailConfirmation extends Component {

  componentDidMount() {
    const { emailConfirmation, emailConfirmationToken } = this.props;
    return emailConfirmation(emailConfirmationToken);
  }

  render() {
    const { t } = this.context;

    return (
      <div className={style.container}>
        <div className={style.tokenValidationInfo}style={{ textAlign: 'center', fontColor: 'gray' }}>
          <Spinner visible /> {t('Validating email confirmation link...')}
        </div>
      </div>
    );
  }
}

EmailConfirmation.propTypes = {
  emailConfirmation: PropTypes.func.isRequired,
  emailConfirmationToken: PropTypes.string.isRequired,
};

EmailConfirmation.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default EmailConfirmation;
