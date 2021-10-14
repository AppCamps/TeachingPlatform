import { getPosts, updateUser } from "../services/api";
import { apiFetched } from "./api";
import { paginationFetched } from "./pagination";

export function markPostsAsRead(user) {
  return (dispatch) => {
    if (!user.unreadPostsPresent) return;

    const userWithoutUnreadPosts = { ...user, unreadPostsPresent: false };
    updateUser(userWithoutUnreadPosts).then((payload) => {
      dispatch(apiFetched(payload));
    });
  };
}

export function fetchPosts(fragments, user) {
  return (dispatch) =>
    getPosts(fragments).then((payload) => {
      dispatch(apiFetched(payload.data));
      dispatch(paginationFetched("posts", payload.links));

      if (user.unreadPostsPresent === true) {
        dispatch(markPostsAsRead(user));
      }
    });
}
