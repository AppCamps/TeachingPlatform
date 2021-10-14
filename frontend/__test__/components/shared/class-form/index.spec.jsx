import React from "react";
import PropTypes from "prop-types";

import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";

import { mount, shallow } from "enzyme";
import { expect } from "../../../chai_helper";

import CreateClassComponent from "../../../../components/shared/class-form";
import Button from "../../../../components/shared/button";
import FaIcon from "../../../../components/shared/fa-icon";

import style from "../../../../components/shared/class-form/style.scss";
import createClassStyle from "../../../../components/shared/class-form/choose-class-type/style.scss";

describe("<CreateClassComponent />", () => {
  const createClass = () => true;
  const defaultProps = {
    formValues: {},
    createClass,
  };

  it("initialize with state { page: 1 }", () => {
    const wrapper = shallow(
      <CreateClassComponent
        {...Object.assign({}, defaultProps, { classes: {} })}
      />,
      {
        context: {
          t(translation) {
            return translation;
          },
        },
      }
    );

    expect(wrapper).to.have.state("page", 1);
  });

  describe("progressBar", () => {
    it("renders progress bar", () => {
      const wrapper = shallow(<CreateClassComponent {...defaultProps} />, {
        context: { t: (translationString) => translationString },
      });

      const progressBarSteps = wrapper.find(`.${style.progressBarStep}`);

      expect(progressBarSteps).to.have.length(3);

      expect(
        wrapper.containsAllMatchingElements([
          <Button>
            <span>
              <FaIcon icon="check" />
            </span>
            <span>{1}</span>Choose class type
          </Button>,
          <Button>
            <span>
              <FaIcon icon="check" />
            </span>
            <span>{2}</span>Add class information
          </Button>,
          <Button>
            <span>
              <FaIcon icon="check" />
            </span>
            <span>{3}</span>Choose courses
          </Button>,
        ])
      ).to.eql(true);
    });

    // TODO fix test. expect(wrapper).to.contain(...) not working
    xit("sets done and active classes based on page", () => {
      const component = (
        <Provider store={createStore(combineReducers({ form: formReducer }))}>
          <CreateClassComponent {...defaultProps} />
        </Provider>
      );
      const wrapper = mount(component, {
        context: { t: (translation) => translation },
        childContextTypes: { t: PropTypes.func },
      });

      expect(wrapper).to.contain(
        <button
          className={`${style.progressBarStep} ${style.progressBarStepActive}`}
        >
          <span className={style.doneIcon}>
            <FaIcon icon="check" />
          </span>
          <span className={style.number}>{1}</span>
          Choose class type
        </button>
      );

      expect(wrapper).to.contain(
        <button className={style.progressBarStep}>
          <span className={style.doneIcon}>
            <FaIcon icon="check" />
          </span>
          <span className={style.number}>{2}</span>
          Add class information
        </button>
      );

      wrapper.setState({ page: 2 });
      wrapper.update();

      expect(wrapper).to.contain(
        <button
          className={`${style.progressBarStep} ${style.progressBarStepDone}`}
        >
          <span className={style.doneIcon}>
            <FaIcon icon="check" />
          </span>
          <span className={style.number}>{1}</span>
          Choose class type
        </button>
      );

      expect(wrapper).to.contain(
        <button
          className={`${style.progressBarStep} ${style.progressBarStepActive}`}
        >
          <span className={style.doneIcon}>
            <FaIcon icon="check" />
          </span>
          <span className={style.number}>{2}</span>
          Add class information
        </button>
      );
    });

    it("renders ChooseClassTypeComponent", () => {
      const component = (
        <Provider store={createStore(combineReducers({ form: formReducer }))}>
          <CreateClassComponent {...defaultProps} />
        </Provider>
      );
      const wrapper = mount(component, {
        context: { t: (translation) => translation },
        childContextTypes: { t: PropTypes.func },
      });

      expect(
        wrapper.find(`.${createClassStyle.chooseClassType}`)
      ).to.be.present();
    });
  });
});
