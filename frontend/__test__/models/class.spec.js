import { expect } from "../chai_helper";
import TestStore from "../orm-helper";

describe("Class", () => {
  let store;
  beforeEach(() => {
    store = new TestStore({});
  });

  it("returns formValues", () => {
    const { factory } = store;
    const klass = factory.create("schoolClass");

    const expectation = {
      id: klass.id,
      resourceType: klass.resourceType,
      className: klass.className,
      schoolYear: klass.schoolYear,
      grade: klass.grade,
      girlCount: klass.girlCount,
      boyCount: klass.boyCount,
      plannedSchoolUsage: klass.plannedSchoolUsage,
      schoolSubject: klass.schoolSubject,
      groupName: null,
      year: null,
      age: null,
      plannedExtracurricularUsage: null,
    };

    expect(klass.formValues()).to.include(expectation);
  });
});
