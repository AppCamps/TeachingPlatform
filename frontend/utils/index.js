import originalSlugify from "slugify";

export function slugify(originalString) {
  if (!originalString) {
    return null;
  }
  const stringForSlug = originalString.replace(/[^A-Za-z0-9_\s]/g, "");
  return originalSlugify(stringForSlug.toLowerCase());
}

export function lowerCaseFirstLetter(originalString) {
  if (!originalString) {
    return null;
  }
  return originalString.charAt(0).toLowerCase() + originalString.slice(1);
}

export function cleanRegExpString(originalString) {
  const stringCopy = originalString;
  if (stringCopy.startsWith("/") && stringCopy.endsWith("/")) {
    return stringCopy.slice(1, stringCopy.length - 1);
  }
  return stringCopy;
}

const internalCardTester = new RegExp(
  /^https?:\/\/.*teach.*\.appcamps\.de\/karten\/.*/
);

/*
 * Checks if link is an internal link to embedded cards.
 * @param link:string
 * @returns boolean
 */
export function isInternalCardLink(link) {
  return internalCardTester.test(link);
}

/*
 * Transforms http(s)://.*teach.*.appcamps.de/karten/code123
 * into
 * {
 *    url: '.*teach.*.appcamps.de/karten',
 *    code: 'code123'
 * }
 * @param link:string
 * @returns { url: string, code: string }
 */
export function parseInternalCardLink(link) {
  const code = link.split("/karten/")[1];
  const url = link.replace(`/${code}`, "").replace(/^https?:\/\//, "");
  return {
    code,
    url,
  };
}
