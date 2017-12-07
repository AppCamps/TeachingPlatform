import { connect } from 'react-redux';
import Posts from '../../components/posts';

import { fetchPosts } from '../../actions/posts';
import { postsSelector, postsPaginationSelector } from '../../selectors/posts';
import { userSelector } from '../../selectors/shared/user';

export function mapStateToProps(state) {
  const pagination = postsPaginationSelector(state);

  return {
    posts: postsSelector(state, pagination.current),
    pagination,
    user: userSelector(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchPosts: (fragments, user) => dispatch(fetchPosts(fragments, user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
