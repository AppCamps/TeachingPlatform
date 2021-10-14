import { push } from "react-router-redux";

import {
  getClasses,
  getClassById,
  updateCompletedLessonsRelation,
  deleteCompletedLessonsRelation,
  createClass as _createClass,
  updateClass as _updateClass,
  archiveClass as _archiveClass,
} from "../services/api";
import { apiFetched } from "./api";

import { SHOW_ALL, SHOW_TOP, TOGGLE_CLASS } from "../constants/classes";

import ClassSerializer from "../serializers/class";

export function fetchClasses() {
  return (dispatch) =>
    getClasses().then((payload) => {
      dispatch(apiFetched(payload));
    });
}

export function fetchClassById(id) {
  return (dispatch) =>
    getClassById(id).then((payload) => {
      dispatch(apiFetched(payload));
    });
}

export function showAllClasses() {
  return (dispatch) => dispatch({ type: SHOW_ALL });
}

export function showTopClasses() {
  return (dispatch) => dispatch({ type: SHOW_TOP });
}

export function toggleClass(klass) {
  return (dispatch) =>
    dispatch({
      type: TOGGLE_CLASS,
      id: klass.id,
    });
}

export function createClass(payload = {}) {
  return (dispatch) => {
    const klassData = ClassSerializer.serialize({ ...payload });
    return _createClass(klassData).then((result) => {
      dispatch(apiFetched(result));
      dispatch(push("/classes"));
    });
  };
}

export function updateClass(klassId, payload = {}) {
  return (dispatch) => {
    const klassData = ClassSerializer.serialize({ ...payload, id: klassId });

    return _updateClass(klassId, klassData).then((result) => {
      dispatch(apiFetched(result));
      dispatch(push("/classes"));
    });
  };
}

export function archiveClass(klassId) {
  return (dispatch) => {
    return _archiveClass(klassId).then((result) => {
      dispatch(apiFetched(result));
      dispatch(push("/classes"));
    });
  };
}

export function markLessonAsComplete(klass, lesson) {
  const newKlass = { ...klass, completedLessons: [lesson.id] };
  const relationPayload =
    ClassSerializer.serialize(newKlass).data.relationships["completed-lessons"];

  return (dispatch) =>
    updateCompletedLessonsRelation(klass.id, relationPayload).then(
      (payload) => {
        dispatch(apiFetched(payload));
      }
    );
}

export function markLessonAsIncomplete(klass, lesson) {
  const newKlass = { ...klass, completedLessons: [lesson.id] };
  const relationPayload =
    ClassSerializer.serialize(newKlass).data.relationships["completed-lessons"];

  return (dispatch) =>
    deleteCompletedLessonsRelation(klass.id, relationPayload).then(
      (payload) => {
        dispatch(apiFetched(payload));
      }
    );
}
