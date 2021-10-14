import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { SubmissionError } from "redux-form";

import { expect } from "../chai_helper";

import {
  passwordResetRequest,
  passwordReset,
  __RewireAPI__ as RewireAPI,
} from "../../actions/password-reset";

import { requestNotification } from "../../actions/notifications";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("PasswordReset actions", () => {
  describe("passwordResetRequest", () => {
    it("should send create request to api, show success notification and push('/')", (done) => {
      const passwordResetRequestApiCallMock = jest.fn(() =>
        Promise.resolve({})
      );
      RewireAPI.__Rewire__(
        "passwordResetRequestApiCall",
        passwordResetRequestApiCallMock
      );

      const expectedActions = global.expect.arrayContaining([
        global.expect.objectContaining({
          type: "@@router/CALL_HISTORY_METHOD",
          payload: {
            method: "push",
            args: ["/"],
          },
        }),
        requestNotification({
          type: "success",
          text: "If the email you provided is registered with App Camps you will soon receive an email containing a link to the reset form.",
        }),
      ]);

      const formData = { email: "test@test.de" };

      const store = mockStore({});
      return store
        .dispatch(passwordResetRequest(formData))
        .then(() => {
          global.expect(store.getActions()).toEqual(expectedActions);

          expect(passwordResetRequestApiCallMock.mock.calls[0]).to.deep.eql([
            formData,
          ]);
          done();
        })
        .catch(done.fail);
    });
  });

  describe("passwordReset", () => {
    describe("success", () => {
      it("should send create request to api, show success notification and push('/')", (done) => {
        const passwordResetApiCallMock = jest.fn(() => Promise.resolve({}));
        RewireAPI.__Rewire__("passwordResetApiCall", passwordResetApiCallMock);

        const expectedActions = global.expect.arrayContaining([
          global.expect.objectContaining({
            type: "@@router/CALL_HISTORY_METHOD",
            payload: {
              method: "push",
              args: ["/"],
            },
          }),
          requestNotification({
            type: "success",
            text: "Password successfully changed. You can now login with your new password.",
            hideOnLocationChange: true,
          }),
        ]);

        const formData = {
          password: "asdasdasd",
          passwordConfirmation: "asdasdasd",
        };
        const token = "123456789";

        const store = mockStore({});
        return store.dispatch(passwordReset(formData, token)).then(() => {
          global.expect(store.getActions()).toEqual(expectedActions);

          expect(passwordResetApiCallMock.mock.calls[0]).to.deep.eql([
            formData,
            token,
          ]);
          done();
        });
      });

      describe("failure", () => {
        it("should show invalid token error notification and push('/password-reset') if resetPasswordToken is invalid", (done) => {
          const passwordResetApiCallMock = jest.fn(() =>
            Promise.reject(
              new SubmissionError({ resetPasswordToken: "is invalid." })
            )
          );
          RewireAPI.__Rewire__(
            "passwordResetApiCall",
            passwordResetApiCallMock
          );

          const expectedActions = global.expect.arrayContaining([
            global.expect.objectContaining({
              type: "@@router/CALL_HISTORY_METHOD",
              payload: {
                method: "push",
                args: ["/password-reset"],
              },
            }),
            requestNotification({
              type: "failure",
              text: "There was an error with your reset link. Please restart the password recovery process.",
            }),
          ]);

          const formData = {
            password: "asdasdasd",
            passwordConfirmation: "asdasdasd",
          };
          const token = "123456789";

          const store = mockStore({});
          return store.dispatch(passwordReset(formData, token)).then(() => {
            global.expect(store.getActions()).toEqual(expectedActions);

            expect(passwordResetApiCallMock.mock.calls[0]).to.deep.eql([
              formData,
              token,
            ]);
            done();
          });
        });

        it("should show expired token error notification and push('/password-reset') if resetPasswordToken is invalid", (done) => {
          const passwordResetApiCallMock = jest.fn(() =>
            Promise.reject(
              new SubmissionError({
                resetPasswordToken: "has expired, please request a new one",
              })
            )
          );
          RewireAPI.__Rewire__(
            "passwordResetApiCall",
            passwordResetApiCallMock
          );

          const expectedActions = global.expect.arrayContaining([
            global.expect.objectContaining({
              type: "@@router/CALL_HISTORY_METHOD",
              payload: {
                method: "push",
                args: ["/password-reset"],
              },
            }),
            requestNotification({
              type: "failure",
              text: "Your password reset link has expired. Please restart the password recovery process.",
            }),
          ]);

          const formData = {
            password: "asdasdasd",
            passwordConfirmation: "asdasdasd",
          };
          const token = "123456789";

          const store = mockStore({});
          return store.dispatch(passwordReset(formData, token)).then(() => {
            global.expect(store.getActions()).toEqual(expectedActions);

            expect(passwordResetApiCallMock.mock.calls[0]).to.deep.eql([
              formData,
              token,
            ]);
            done();
          });
        });

        it("should rethrow submission error for other errors", (done) => {
          const thrownError = new SubmissionError({
            passwordConfirmation: "notEqual.",
          });
          const passwordResetApiCallMock = jest.fn(() =>
            Promise.reject(thrownError)
          );
          RewireAPI.__Rewire__(
            "passwordResetApiCall",
            passwordResetApiCallMock
          );

          const formData = {
            password: "asdasdasd",
            passwordConfirmation: "asdasdasd",
          };
          const token = "123456789";

          const store = mockStore({});
          return store
            .dispatch(passwordReset(formData, token))
            .then(done.fail)
            .catch((error) => {
              expect(store.getActions()).to.deep.equal([]);
              expect(error).to.eql(thrownError);

              done();
            })
            .catch(done.fail);
        });

        it("should rethrow error if not matched)", (done) => {
          const thrownError = new Error("test error.");
          const passwordResetApiCallMock = jest.fn(() =>
            Promise.reject(thrownError)
          );
          RewireAPI.__Rewire__(
            "passwordResetApiCall",
            passwordResetApiCallMock
          );

          const formData = {
            password: "asdasdasd",
            passwordConfirmation: "asdasdasd",
          };
          const token = "123456789";

          const store = mockStore({});
          return store
            .dispatch(passwordReset(formData, token))
            .then(done.fail)
            .catch((error) => {
              expect(store.getActions()).to.deep.equal([]);
              expect(error).to.eql(thrownError);

              done();
            })
            .catch(done.fail);
        });
      });
    });
  });
});
