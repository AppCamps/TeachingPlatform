import { getPreparationMaterials } from "../services/api";
import { apiFetched } from "./api";

export function fetchPreparationMaterials() {
  return (dispatch) =>
    getPreparationMaterials().then((payload) => {
      dispatch(apiFetched(payload));
    });
}
