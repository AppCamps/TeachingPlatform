import { Model, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const defaultModifier = rel => rel;

/* all models must be added to ../orm.js */
class BaseModel extends Model {
  static parse(attributes) {
    return this.create(attributes);
  }

  isPersisted() {
    return this.fetchedAt !== null;
  }

  // method for extended refs, like inclusions via model.includeMany or model.ncludeRef
  // overwrite to enrich data via model methods e.g. course.className
  // but be sure not to return a new object instance there
  get includeRef() {
    /* eslint-disable no-underscore-dangle */
    if (!this.__includeRefClone) {
      this.__includeRefClone = { ...this.ref };
    }
    return Object.assign(this.__includeRefClone, {
      isPersisted: this.isPersisted(),
    });
    /* eslint-enable no-underscore-dangle */
  }

  includeMany(parameters) {
    const clone = this.includeRef;
    const modifier = parameters.modifier || defaultModifier;
    const { relations } = parameters;

    relations.forEach((relation) => {
      const relationObject = modifier(this[relation]);
      clone[relation] = relationObject.toModelArray().map(relModel => relModel.includeRef);
    });

    return clone;
  }

  includeFk(relationName) {
    const clone = this.includeRef;
    const relationModel = this[relationName];
    clone[relationName] = relationModel ? relationModel.includeRef : null;
    return clone;
  }
}

BaseModel.fields = {
  fetchedAt: attr(),
  isFetching: attr(),
};

BaseModel.defaultProps = {
  fetchedAt: null,
  isFetching: false,
};

export default propTypesMixin(BaseModel);
