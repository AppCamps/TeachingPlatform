import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import autobind from 'autobind-decorator';

import classNames from 'classnames';

import { Shape as CourseSchoolClassShape } from '../../../../models/course-school-class';

import { colors } from '../../../../config';
import Number from '../../number';
import HelpIcon from '../../help-icon';
import FaIcon from '../../fa-icon';

import style from './style.scss';

class Certificate extends Component {
  @autobind
  handleDownloadCertificate() {
    const { courseSchoolClass, downloadCertificate } = this.props;

    downloadCertificate(courseSchoolClass);
  }

  render() {
    const { t } = this.context;
    const { number, courseSchoolClass, isAvailable, color } = this.props;

    const certColor = isAvailable ? color : colors.colorGray;

    const borderColor = certColor;
    const customStyle = {
      certColor,
      borderColor: certColor,
    };

    const certificateClasses = classNames({
      [style.disabled]: !isAvailable,
    });

    let components = (
      <div style={customStyle} className={certificateClasses}>
        <div className={style.numberContainer} style={{ borderColor }}>
          <Number
            number={number}
            color={certColor}
            invert={courseSchoolClass && courseSchoolClass.certificateDownloaded}
          />
        </div>
        <div className={style.certificateTitle}>
          {!isAvailable && (
            <span>
              <FaIcon icon="lock" />{' '}
            </span>
          )}
          {t('Certificates')}
        </div>
        <div className={style.info}>
          {!isAvailable ? (
            t('Available when all lessons are completed.')
          ) : (
            t('Click here to download your template.')
          )}
        </div>
      </div>
    );

    if (isAvailable) {
      components = (
        <a role="button" tabIndex="0" onClick={this.handleDownloadCertificate}>
          {components}
        </a>
      );
    }

    return (
      <div className={style.certificate}>
        <span className={style.help}>
          <Link to="/help/certificates" title={t('Click to get help')}>
            <HelpIcon />
          </Link>
        </span>
        {components}
      </div>
    );
  }
}

Certificate.propTypes = {
  number: PropTypes.number.isRequired,
  courseSchoolClass: CourseSchoolClassShape,
  isAvailable: PropTypes.bool,
  color: PropTypes.string,
  downloadCertificate: PropTypes.func,
};

Certificate.contextTypes = {
  t: PropTypes.func.isRequired,
};

Certificate.defaultProps = {
  certificateUrl: null,
  isCompleted: false,
  isAvailable: false,
  isProgressIndicator: false,
  color: colors.colorFontDefault,
  courseSchoolClass: null,
  downloadCertificate: () => null,
};

export default Certificate;
