import { createLocality as apiCallCreateLocality } from "../services/api";
import { apiFetched } from "./api";

export function createLocality(locality) {
  return (dispatch) => {
    const { schoolTypeCustom, state } = locality;
    const localityData = { ...locality };

    if (schoolTypeCustom) {
      localityData.schoolType = "school_type_custom";
    }
    if (state) {
      localityData.state = state.toUpperCase();
    }

    return apiCallCreateLocality(localityData).then((result) => {
      dispatch(apiFetched(result));
    });
  };
}
