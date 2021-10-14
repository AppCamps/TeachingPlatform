import { createSelector } from "reselect";
import chunk from "lodash.chunk";

import { ormSelector, createOrmSelector } from "./orm";
import { paginationSelector } from "./shared/pagination";
import { userSelector } from "./shared/user";

const pageSelector = (state, page) => page;

export const postsSelector = createSelector(
  ormSelector,
  pageSelector,
  paginationSelector("posts"),
  createOrmSelector((session, page, pagination) => {
    const posts = session.Post.orderBy(
      ["pinned", "releasedAt"],
      ["desc", "desc"]
    ).toRefArray();

    const chunkedPosts = chunk(posts, pagination.size || posts.length);
    return chunkedPosts[page && page > 0 ? page - 1 : 0];
  })
);

export const postsPaginationSelector = paginationSelector("posts");

export const unreadPostsPresentSelector = (state) =>
  userSelector(state).unreadPostsPresent;
