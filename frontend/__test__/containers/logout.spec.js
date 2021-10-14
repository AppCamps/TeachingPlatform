import { mapDispatchToProps, __RewireAPI__ } from "../../containers/logout";

describe("Logout container", () => {
  describe("#mapDispatchToProps", () => {
    describe("#logoutUser", () => {
      afterEach(() => {
        __RewireAPI__.__ResetDependency__();
      });

      // eslint-disable-next-line consistent-return
      const thunkMock = (objectOrFunction) => {
        if (typeof objectOrFunction === "function") {
          return objectOrFunction();
        }
        return Promise.resolve(objectOrFunction);
      };

      it("redirects on success", (done) => {
        const dispatch = jest.fn(thunkMock);
        __RewireAPI__.__Rewire__("logoutUser", () =>
          Promise.resolve("logoutUser")
        );

        const props = mapDispatchToProps(dispatch);

        props
          .logoutUser()
          .then(() => {
            // necessary to catch setTimeout dispatch
            setTimeout(() => {
              expect(dispatch.mock.calls).toHaveLength(2);

              expect(dispatch.mock.calls[0]).toHaveLength(1);
              expect(dispatch.mock.calls[0][0]).toBeInstanceOf(Promise);

              expect(dispatch.mock.calls[1]).toHaveLength(1);
              expect(dispatch.mock.calls[1][0]).toEqual({
                type: "@@router/CALL_HISTORY_METHOD",
                payload: { method: "push", args: ["/login"] },
              });

              done();
            }, 0);
          })
          .catch(done.fail);
      });

      it("redirects on failure", (done) => {
        const dispatch = jest.fn(thunkMock);
        __RewireAPI__.__Rewire__("logoutUser", () =>
          Promise.reject("logoutUser")
        );

        const props = mapDispatchToProps(dispatch);

        props
          .logoutUser()
          .then(() => {
            // necessary to catch setTimeout dispatch
            setTimeout(() => {
              expect(dispatch.mock.calls).toHaveLength(2);

              expect(dispatch.mock.calls[0]).toHaveLength(1);
              expect(dispatch.mock.calls[0][0]).toBeInstanceOf(Promise);

              expect(dispatch.mock.calls[1]).toHaveLength(1);
              expect(dispatch.mock.calls[1][0]).toEqual({
                type: "@@router/CALL_HISTORY_METHOD",
                payload: { method: "push", args: ["/login"] },
              });

              done();
            }, 0);
          })
          .catch(done.fail);
      });
    });
  });
});
