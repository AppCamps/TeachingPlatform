import moxios from "moxios";

import { expect } from "../../chai_helper";

import { notifications } from "../../../config";
import { requestNotification } from "../../../actions/notifications";

import {
  fetch,
  initializeApi,
  __RewireAPI__ as ApiRewire,
} from "../../../services/api/helpers";

describe("Api", () => {
  let dispatchMock;
  let logMock;
  let trackErrorMock;

  beforeEach(() => {
    logMock = jest.fn();
    dispatchMock = jest.fn();
    trackErrorMock = jest.fn();

    ApiRewire.__Rewire__("log", logMock);
    ApiRewire.__Rewire__("trackError", trackErrorMock);

    initializeApi({ dispatch: dispatchMock });
    moxios.install();
  });

  afterEach(() => {
    ApiRewire.__ResetDependency__("log");
    ApiRewire.__ResetDependency__("trackError");
    moxios.uninstall();
  });

  describe("logging", () => {
    it("logs requests", (done) => {
      moxios.stubRequest("/api/test", {
        method: "POST",
        headers: {
          "X-Request-Id": "359f9f30-9c4d-4d67-80d0-ad41a3869b4c",
        },
        status: 200,
        responseText: "{}",
      });

      const request = {
        method: "POST",
        data: {},
      };

      fetch("/api/test", request)
        .then(() => {
          expect(logMock.mock.calls).to.have.length(2);
          expect(logMock.mock.calls[0]).to.eql(["POST /api/test: [Request]"]);
          expect(logMock.mock.calls[1]).to.eql([
            "POST /api/test: [Response] Statuscode 200 (Request ID: 359f9f30-9c4d-4d67-80d0-ad41a3869b4c)",
          ]);

          done();
        })
        .catch(done.fail);
    });
  });

  describe("network and server error handling", () => {
    it("dispatches notification server network", (done) => {
      moxios.stubRequest("/api/server-error", {
        headers: {},
        status: 500,
        responseText: "<html />",
      });

      fetch("/api/server-error", { method: "GET" })
        .catch(() => {
          expect(logMock.mock.calls).to.have.length(1);
          expect(logMock.mock.calls[0]).to.eql([
            "GET /api/server-error: [Request]",
          ]);

          const trackErrorCalls = trackErrorMock.mock.calls;
          expect(trackErrorCalls).to.have.length(1);
          expect(trackErrorCalls[0][0].message).to.eql(
            "Request failed with status code 500"
          );

          const dispatchCalls = dispatchMock.mock.calls;
          expect(dispatchCalls).to.have.length(1);
          expect(dispatchCalls[0][0]).to.eql(
            requestNotification({
              type: notifications.failure,
              text: "There was an Error processing your request. Please contact orga@appcamps.de if the problem persists.",
            })
          );

          done();
        })
        .catch(done.fail);
    });

    it("dispatches notification on request throttle", (done) => {
      moxios.stubRequest("/api/login", {
        headers: {
          "X-Request-Id": "12345",
        },
        status: 429,
        responseText: "too many",
      });

      fetch("/api/login", { method: "GET" })
        .catch(() => {
          expect(logMock.mock.calls).to.have.length(2);
          expect(logMock.mock.calls).to.eql([
            ["GET /api/login: [Request]"],
            ["GET /api/login: [Response] Statuscode 429 (Request ID: 12345)"],
          ]);

          expect(trackErrorMock.mock.calls).to.have.length(0);

          const dispatchCalls = dispatchMock.mock.calls;
          expect(dispatchCalls).to.have.length(1);
          expect(dispatchCalls[0][0]).to.eql(
            requestNotification({
              type: notifications.failure,
              text: "Too many requests. Please try again in a few seconds.",
            })
          );

          done();
        })
        .catch(done.fail);
    });
  });
});
