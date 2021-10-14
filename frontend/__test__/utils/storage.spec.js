import { expect } from "../chai_helper";
import {
  LocalStorage,
  CookieStorage,
  MemoryStorage,
  getStorage,
} from "../../utils/storage";

describe("Storage", () => {
  describe("Fallback mechanism", () => {
    it("should use local storage when supported", () => {
      const w = { Storage: {} };
      const storage = getStorage(w);

      expect(storage).to.exist.and.be.instanceof(LocalStorage);
    });

    it("should fallback to cookies when local storage is not supported", () => {
      const w = { navigator: { cookieEnabled: true } };
      const storage = getStorage(w);

      expect(storage).to.exist.and.be.instanceof(CookieStorage);
    });

    it("should fallback to memory storage when local storage is not supported and cookies are disabled", () => {
      const w = { navigator: { cookieEnabled: false } };
      const storage = getStorage(w);

      expect(storage).to.exist.and.be.instanceof(MemoryStorage);
    });
  });

  describe("LocalStorage", () => {
    const storage = new LocalStorage({ ...global, Storage: {} });
    beforeEach(() => {
      storage.clear();
    });

    it("should set value", () => {
      expect(global.localStorage.getItem("test")).to.not.exist;
      storage.set("test", "value1");
      expect(global.localStorage.getItem("test")).to.exist.and.equal("value1");
    });

    it("should get value", () => {
      global.localStorage.setItem("test", "value2");
      expect(storage.get("test")).to.exist.and.equal("value2");
    });

    it("should remove value", () => {
      global.localStorage.setItem("test", "value3");
      storage.remove("test");
      expect(global.localStorage.getItem("test")).to.not.exist;
    });
  });

  describe("CookieStorage", () => {
    const storage = new CookieStorage({ ...global });

    beforeEach(() => {
      storage.clear();
    });

    it("should get and set value", () => {
      expect(storage.get("test")).to.not.exist;
      storage.set("test", "value1");
      expect(storage.get("test")).to.exist.and.equal("value1");
    });

    it("should remove value", () => {
      expect(storage.get("test")).to.not.exist;
      storage.set("test", "value2");
      expect(storage.get("test")).to.exist.and.equal("value2");
      storage.remove("test");
      expect(storage.get("test")).to.not.exist;
    });
  });

  describe("MemoryStorage", () => {
    const storage = new MemoryStorage();

    beforeEach(() => {
      storage.clear();
    });

    it("should set value", () => {
      expect(storage.storage.test).to.not.exist;
      storage.set("test", "value1");
      expect(storage.storage.test).to.exist.and.equal("value1");
    });

    it("should get value", () => {
      storage.storage.test = "value2";
      expect(storage.get("test")).to.exist.and.equal("value2");
    });

    it("should remove value", () => {
      storage.storage.test = "value3";
      storage.remove("test");
      expect(storage.storage.test).to.not.exist;
    });
  });
});
