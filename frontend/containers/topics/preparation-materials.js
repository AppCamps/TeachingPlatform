import { connect } from "react-redux";

import Preparations from "../../components/topics/preparation-materials";

import { preparationMaterialsSelector } from "../../selectors/topics/preparation-materials";

export function mapStateToProps(state, { params: { topicSlug } }) {
  return {
    preparationMaterials: preparationMaterialsSelector(state, topicSlug),
  };
}

export default connect(mapStateToProps)(Preparations);
