import PropTypes from "prop-types";
import { attr, fk } from "redux-orm";

import BaseModel from ".";

class TeachingMaterial extends BaseModel {
  get isVideo() {
    return this.mediumType === "medium_type_video";
  }

  get includeRef() {
    return Object.assign(super.includeRef, {
      isVideo: this.isVideo,
    });
  }
}

TeachingMaterial.modelName = "TeachingMaterial";

TeachingMaterial.fields = {
  ...BaseModel.fields,
  id: attr(),
  position: attr(),
  title: attr(),
  subtitle: attr(),
  description: attr(),
  mediumType: attr(),
  image: attr(),
  icon: attr(),
  link: attr(),
  listingTitle: attr(),
  listingIcon: attr(),
  lessonContent: attr(),
  listingItem: attr(),
  lesson: fk("Lesson", "teachingMaterials"),
};

TeachingMaterial.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  position: null,
  title: "",
  subtitle: "",
  description: "",
  mediumType: null,
  icon: null,
  link: null,
  image: null,
  listingTitle: "",
  listingIcon: null,
  lessonContent: false,
  listingItem: false,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  position: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  mediumType: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  listingTitle: PropTypes.string,
  listingIcon: PropTypes.string,
  lessonContent: PropTypes.bool,
  listingItem: PropTypes.bool,
});

export default TeachingMaterial;
export { Shape };
