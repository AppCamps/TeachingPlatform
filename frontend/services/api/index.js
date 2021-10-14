import { initializeApi, fetch, normalize, normalizeErrors } from "./helpers";

import SessionSerializer from "../../serializers/session";
import UserSerializer from "../../serializers/user";
import UserRegistrationSerializer from "../../serializers/user/registration";
import LocalitySerializer from "../../serializers/locality";

// api has to be initialized with store in order to dispatch errors
export { initializeApi };

function legacyError(result) {
  return result.errors;
}

export function createUser(user) {
  const payload = UserRegistrationSerializer.serialize(user);

  return fetch("/api/user", {
    method: "POST",
    data: JSON.stringify(payload),
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
}

export function createSession(loginData) {
  const payload = SessionSerializer.serialize({
    email: loginData.email,
    password: loginData.password,
  });

  return fetch("/api/session", {
    method: "POST",
    data: JSON.stringify(payload),
  })
    .then(normalize())
    .catch(normalizeErrors(legacyError));
}

export function getSession() {
  return fetch("/api/session", {
    method: "GET",
  })
    .then(normalize())
    .catch(normalizeErrors(legacyError));
}

export function deleteSession() {
  return fetch("/api/session", {
    method: "DELETE",
  })
    .then(normalize())
    .catch(normalizeErrors());
}

export function getCourses() {
  return fetch("/api/courses", {
    method: "GET",
  }).then(normalize());
}

export function updateCourseSchoolClass(payload) {
  return fetch(`/api/course_school_classes/${payload.data.id}`, {
    method: "PUT",
    data: JSON.stringify(payload),
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
}

export function getPreparationMaterials() {
  return fetch("/api/preparation_materials", {
    method: "GET",
  }).then(normalize());
}

export function updateUser(user) {
  const payload = UserSerializer.serialize(user);

  return fetch("/api/user", {
    method: "PUT",
    data: JSON.stringify(payload),
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
}

export function getClasses() {
  return fetch("/api/classes", {
    method: "GET",
  }).then(normalize());
}

export function getClassById(id) {
  return fetch(`/api/classes?filter[classes.id]=${id}`, {
    method: "GET",
  }).then(normalize());
}

export function createClass(payload) {
  delete payload.data.id;

  return fetch("/api/classes", {
    method: "POST",
    data: JSON.stringify(payload),
  }).then(normalize());
}

export function updateClass(klassId, payload) {
  return fetch(`/api/classes/${klassId}`, {
    method: "PUT",
    data: JSON.stringify(payload),
  }).then(normalize());
}

export function archiveClass(klassId) {
  return fetch(`/api/classes/${klassId}/archive`, {
    method: "PUT",
  }).then(normalize());
}

export function updateCompletedLessonsRelation(classId, payload) {
  return fetch(`/api/classes/${classId}/relationships/completed-lessons`, {
    method: "PUT",
    data: JSON.stringify(payload),
  }).then(normalize());
}

export function deleteCompletedLessonsRelation(classId, payload) {
  return fetch(`/api/classes/${classId}/relationships/completed-lessons`, {
    method: "DELETE",
    data: JSON.stringify(payload),
  }).then(normalize());
}

export function getCountries() {
  return fetch("/api/countries", {
    method: "GET",
  }).then(normalize());
}

export function getPosts(fragments) {
  let url = `/api/posts?page[number]=${fragments.number || 1}`;
  if (fragments.size) url += `&page[size]=${fragments.size}`;

  return fetch(url, {
    method: "GET",
  }).then((result) => ({
    data: normalize()(result),
    links: result.links,
  }));
}

export function createLocality(locality) {
  const payload = LocalitySerializer.serialize(locality);

  return fetch("/api/locality", {
    method: "POST",
    data: JSON.stringify(payload),
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
}

export function passwordResetRequest(formData) {
  const payload = UserRegistrationSerializer.serialize(formData);

  return fetch("/api/password-reset", {
    method: "POST",
    data: JSON.stringify(payload),
  });
}

export function passwordReset(formData, passwordResetToken) {
  const payload = UserRegistrationSerializer.serialize(formData);
  return fetch(`/api/password-reset/${passwordResetToken}`, {
    method: "PUT",
    data: JSON.stringify(payload),
  })
    .then(normalize(() => ({})))
    .catch(normalizeErrors(null, true));
}

export function emailConfirmationRequest(formData) {
  const payload = UserRegistrationSerializer.serialize(formData);

  return fetch("/api/confirmations", {
    method: "POST",
    data: JSON.stringify(payload),
  });
}

export function emailConfirmation(emailConfirmationToken) {
  const payload = { data: {} };
  return fetch(`/api/confirmations/${emailConfirmationToken}`, {
    method: "PUT",
    data: JSON.stringify(payload),
  })
    .then(normalize(() => ({})))
    .catch(normalizeErrors(null, true));
}
