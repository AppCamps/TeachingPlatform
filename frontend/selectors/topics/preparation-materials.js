import { createSelector } from "reselect";

import { topicBySlugSelector } from "../shared/topic";

export { topicBySlugSelector };

export const preparationMaterialsSelector = createSelector(
  [topicBySlugSelector],
  (selectedTopic) =>
    selectedTopic.preparationMaterials
      .orderBy("position")
      .toModelArray()
      .map((preparationMaterial) => {
        preparationMaterial.includeFk("topic");
        return preparationMaterial.includeRef;
      })
);
