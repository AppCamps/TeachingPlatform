import { API_FETCHED } from '../../constants/api';
import orm, { modelNames } from '../../orm';
import { lowerCaseFirstLetter } from '../../utils';

const reducer = (state = orm.getEmptyState(), action) => {
  switch (action.type) {
    case API_FETCHED: {
      const session = orm.session(state);
      const fetchedAt = Date.now();

      modelNames.forEach((modelName) => {
        const modelKlass = session[modelName];
        const collectionName = modelKlass.collectionKey || lowerCaseFirstLetter(`${modelName}s`);
        const collection = action.payload[collectionName] || {};

        Object.values(collection).forEach((attributes) => {
          if (modelKlass.hasId(attributes.id)) {
            const modelInstance = modelKlass.withId(attributes.id);
            return modelInstance.update({ ...attributes, fetchedAt, isFetching: false });
          }
          return modelKlass.create({ ...attributes, fetchedAt, isFetching: false });
        });
      });

      return session.state;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
