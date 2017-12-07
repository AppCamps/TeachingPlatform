import reduce from 'lodash.reduce';
import autobind from 'autobind-decorator';

class ORMFactory {
  constructor(options) {
    this.factories = {};
    this.options = options;
    this.sequenceCounter = 0;
  }

  helpers(mode = 'build') {
    const _helpers = {
      seq: this.seq,
      rel: {
        many: this.buildMany,
        one: this.build,
      },
    };

    if (mode === 'create') {
      _helpers.rel = {
        many: this.createMany,
        one: this.create,
      };
    }

    return _helpers;
  }

  register(factoryName, className, attributesDefFn = () => ({})) {
    this.factories[factoryName] = {
      className,
      attributesDefFn,
    };
  }

  @autobind
  seq() {
    this.sequenceCounter += 1;
    return this.sequenceCounter;
  }

  @autobind
  buildMany(factoryName, count = 1, customAttributes = {}, buildModifiers = {}) {
    const relationInstances = [];

    for (let i = 0; i < count; i += 1) {
      relationInstances.push(this.build(factoryName, customAttributes, buildModifiers));
    }

    return relationInstances;
  }

  @autobind
  createMany(factoryName, count = 1, customAttributes = {}, buildModifiers = {}) {
    const relationInstances = [];

    for (let i = 0; i < count; i += 1) {
      relationInstances.push(this.create(factoryName, customAttributes, buildModifiers));
    }

    return relationInstances.map(rel => rel.id);
  }

  getFactory(factoryName) {
    const factoryDef = this.factories[factoryName];
    if (!factoryDef) {
      throw new Error(`Factory "${factoryName}" is not registered.`);
    }
    return factoryDef;
  }

  getClassName(factoryName) {
    return this.getFactory(factoryName).className;
  }

  getAttributesDefFn(factoryName) {
    return this.getFactory(factoryName).attributesDefFn;
  }

  attributesFor(factoryName, customAttributes = {}, buildModifiers = {}, mode = 'build') {
    const attributesDefFn = this.getAttributesDefFn(factoryName);
    const obj = reduce(
      attributesDefFn(buildModifiers),
      (memo, value, key) => {
        if (typeof value === 'function') {
          memo[key] = value(this.helpers(mode), customAttributes);
        } else {
          memo[key] = value;
        }
        return memo;
      },
      {},
    );
    return { ...obj, ...customAttributes };
  }

  @autobind
  build(factoryName, customAttributes = {}, buildModifiers = {}) {
    return this.attributesFor(factoryName, customAttributes, buildModifiers, 'build');
  }

  buildList(factoryName, count, customAttributes = {}, buildModifiers = {}) {
    if (!count) {
      throw new Error(`You must specify a count parameter for buildList('${factoryName}')`);
    }
    const list = [];
    for (let i = 0; i < count; i += 1) {
      list.push(this.build(factoryName, customAttributes, buildModifiers));
    }
    return list;
  }

  @autobind
  create(factoryName, customAttributes = {}, buildModifiers = {}) {
    const className = this.getClassName(factoryName);

    const model = this.session[className];
    const modelInstance = model.create(
      this.attributesFor(factoryName, customAttributes, buildModifiers, 'create'),
    );
    return modelInstance;
  }

  createList(factoryName, count, customAttributes = {}, buildModifiers = {}) {
    if (!count) {
      throw new Error(`You must specify a count parameter for createList('${factoryName}')`);
    }
    const list = [];
    for (let i = 0; i < count; i += 1) {
      list.push(this.create(factoryName, customAttributes, buildModifiers));
    }
    return list;
  }
}

export default ORMFactory;
