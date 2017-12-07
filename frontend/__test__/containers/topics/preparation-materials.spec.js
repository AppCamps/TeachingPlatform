import { expect } from '../../chai_helper';
import TestStore from '../../orm-helper';

import { initialState } from '../../../reducers/preparations';

import { mapStateToProps } from '../../../containers/topics/preparation-materials';

describe('Descriptions Container', () => {
  let store;
  beforeEach(() => {
    store = new TestStore({
      preparations: initialState,
    });
  });

  describe('mapStateToProps', () => {
    it('returns ordered preparationMaterials for topicSlug', () => {
      const { factory, state } = store;
      const topic = factory.create(
        'topic',
        {},
        {
          preparationMaterialsCount: 0,
        },
      );

      const prepMat1 = factory.create('preparationMaterial', { position: 2, topic });
      prepMat1.includeFk('topic');

      const prepMat2 = factory.create('preparationMaterial', { position: 1, topic });
      prepMat2.includeFk('topic');

      const props = mapStateToProps(state, {
        params: {
          topicSlug: topic.slug,
        },
      });

      expect(props.preparationMaterials).to.eql([prepMat2.includeRef, prepMat1.includeRef]);
    });
  });
});
