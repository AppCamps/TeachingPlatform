import React from "react";
import { shallow } from "enzyme";

import { expect } from "../chai_helper";
import factory from "../__factories__";

import EditClass from "../../components/edit-class";

import Link from "../../components/shared/link";
import ClassForm from "../../components/shared/class-form";

import style from "../../components/create-class/style.scss";

describe("<EditClass />", () => {
  const initializeForm = jest.fn();
  const destroyForm = jest.fn();
  const fetchClassById = jest.fn(() => Promise.resolve());
  const fetchCourses = jest.fn(() => Promise.resolve());
  const formValues = {};
  const klass = factory.build("schoolClass");
  const topic = factory.build("topic");
  const topics = [topic];
  topic.courses = factory.buildList("course", 2);

  const defaultProps = {
    klass,
    topics,
    initializeForm,
    destroyForm,
    fetchClassById,
    fetchCourses,
    formValues,
    router: {
      setRouteLeaveHook: jest.fn(),
    },
  };

  beforeEach(() => {
    initializeForm.mockClear();
    destroyForm.mockClear();
    fetchClassById.mockClear();
    fetchCourses.mockClear();
  });

  it("calls destroyForm on unmount", () => {
    const wrapper = shallow(
      <EditClass {...defaultProps} destroyForm={destroyForm} />,
      {
        context: {
          t(translation) {
            return translation;
          },
        },
      }
    );

    expect(destroyForm.mock.calls.length).to.eql(0);

    wrapper.unmount();

    expect(destroyForm.mock.calls.length).to.eql(1);
  });

  it("renders a cancel link", () => {
    const wrapper = shallow(<EditClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    const link = wrapper.find(`.${style.cancel}`).find(Link);

    expect(link.prop("to")).to.equal("/classes");
    expect(link.children().first()).to.have.text("cancel");
  });

  it("calls fetchCourses on load", () => {
    shallow(<EditClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(fetchCourses.mock.calls.length).to.eql(1);
  });

  it("calls fetchClassById with klassId on load", () => {
    shallow(<EditClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(fetchClassById.mock.calls.length).to.eql(1);
    expect(fetchClassById.mock.calls[0]).to.eql([klass.id]);
  });

  it("sets formValues on initial load", () => {
    const wrapper = shallow(<EditClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    expect(initializeForm.mock.calls.length).to.eql(0);
    const existingKlass = { ...klass, isPersisted: true };
    wrapper.setProps({ klass: existingKlass });

    expect(initializeForm.mock.calls.length).to.eql(1);
    expect(initializeForm.mock.calls[0]).to.deep.eql([existingKlass]);

    wrapper.update();

    expect(initializeForm.mock.calls.length).to.eql(1);
  });

  it("forwards all props to ClassForm", () => {
    const wrapper = shallow(<EditClass {...defaultProps} />, {
      context: {
        t(translation) {
          return translation;
        },
      },
    });

    const renderedClassForm = wrapper.find(ClassForm);

    expect(renderedClassForm).to.have.prop("formValues", formValues);
    expect(renderedClassForm).to.have.prop("topics", topics);
    expect(renderedClassForm).to.have.prop("submitText", "Save");
    expect(renderedClassForm.prop("handleSubmit")).to.be.a("function");
  });
});
