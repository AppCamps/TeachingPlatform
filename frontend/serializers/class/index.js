import SchoolClassSerializer from "./school-class";
import ExtracurricularSerializer from "./extracurricular";

export default {
  serialize: (attributes) => {
    if (attributes.resourceType === "school_class") {
      return SchoolClassSerializer.serialize(attributes);
    }
    return ExtracurricularSerializer.serialize(attributes);
  },
};
