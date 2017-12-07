
export class LocalStorage {

  /**
   * @param w - window object
   * */
  constructor(w) {
    if (!LocalStorage.isSupported(w)) {
      throw new Error('LocalStorage is not supported');
    }
    this.storage = w.localStorage;
  }

  /**
   * Check is localStorage/sessionStorage is supported.
   *
   * @param w - window object
   * */
  static isSupported(w) {
    return !!w.Storage;
  }

  set(key, value) {
    this.storage.setItem(key, value);
  }

  get(key) {
    return this.storage.getItem(key);
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

export class CookieStorage {

  /**
   * @param w - window object
   * */
  constructor(w) {
    if (!CookieStorage.isSupported(w)) {
      throw new Error('Cookies are disabled');
    }
    this.doc = w.document;
  }

  /**
   * Check if cookies are enabled in the browser.
   * @param w - window object
   * */
  static isSupported(w) {
    return w.navigator.cookieEnabled;
  }

  set(key, value) {
    this.doc.cookie = `${key}=${value};path=/`;
  }

  get(key) {
    const cookieKey = `${key}=`;
    const keyValues = decodeURIComponent(this.doc.cookie).split(';');
    const match = keyValues.filter(keyValue => keyValue.startsWith(cookieKey));
    if (match.length === 0) {
      return undefined;
    }

    // Remove "key="
    return match[0].substring(cookieKey.length, match[0].length);
  }

  remove(key) {
    this.doc.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }

  clear() {
    const keyValues = decodeURIComponent(this.doc.cookie).split(';');
    keyValues
      // Get keys from key value strings
      .map(keyValue => keyValue.split('=')[0])
      // Remove all keys
      .forEach(key => this.remove(key));
  }
}

export class MemoryStorage {

  /**
   * @param w - window object
   * */
  constructor() {
    this.storage = {};
  }

  static isSupported() {
    return true;
  }

  set(key, value) {
    this.storage[key] = value;
  }

  get(key) {
    return this.storage[key];
  }

  remove(key) {
    delete this.storage[key];
  }

  clear() {
    this.storage = {};
  }
}

/**
 * Obtain a functional storage.
 * */
export function getStorage(windowRef) {
  // Use window by default if not provided.
  // Giving it in param allows testing.
  const w = windowRef || window;
  try {
    return new LocalStorage(w);
  } catch (e) {
    // Fallback to next
  }
  try {
    return new CookieStorage(w);
  } catch (e) {
    // Fallback to next
  }
  // Always works
  return new MemoryStorage(w);
}

// Export functional storage
export default getStorage();
