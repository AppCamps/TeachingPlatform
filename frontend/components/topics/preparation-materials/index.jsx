import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PreparationMaterial from './preparation-material';
import { Shape as PreparationMaterialShape } from '../../../models/preparation-material';

import style from './style.scss';

class Preparations extends Component {
  renderPreparationMaterials() {
    const { t } = this.context;
    const { preparationMaterials } = this.props;

    if (!preparationMaterials || preparationMaterials.length === 0) {
      return `${t('There are no preparation materials for this topic.')}`;
    }

    return preparationMaterials.map(preparationMaterial => (
      <div key={preparationMaterial.id} className={style.preparationMaterial}>
        <PreparationMaterial preparationMaterial={preparationMaterial} />
      </div>
    ));
  }

  render() {
    const { t } = this.context;
    return (
      <div className={style.container}>
        <p>{t('Here are important informations and materials to prepare your lessons.')}</p>
        <div>{this.renderPreparationMaterials()}</div>
      </div>
    );
  }
}

Preparations.propTypes = {
  preparationMaterials: PropTypes.arrayOf(PropTypes.shape(PreparationMaterialShape)),
};

Preparations.defaultProps = {
  preparationMaterials: null,
};

Preparations.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Preparations;
