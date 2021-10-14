import orm from "../orm";
import factory from "./__factories__";

class TestStore {
  constructor(state = {}) {
    this._state = {
      orm: orm.getEmptyState(),
      ...state,
    };
    this.session = orm.mutableSession(state.orm);
    this.factory = factory;
    this.orm = orm;

    factory.session = this.session;
  }

  get state() {
    return {
      ...this._state,
      orm: this.session.state,
    };
  }
}

export default TestStore;
