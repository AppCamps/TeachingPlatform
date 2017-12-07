import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reactParser from 'html-react-parser';

import { Shape as PostShape } from '../../models/post';
import { Shape as UserShape } from '../../models/user';
import FaIcon from '../shared/fa-icon';
import Link from '../shared/link';

import style from './style.scss';

function formatDate(dateString) {
  const date = new Date(dateString);

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

class Posts extends Component {
  componentDidMount() {
    this.fetchPosts(1);
  }

  fetchPosts(pageNumber) {
    const { pagination: { size }, user } = this.props;

    const pageFragments = {
      number: pageNumber,
      size,
    };
    this.props.fetchPosts(pageFragments, user);
  }

  renderPagination() {
    const { t } = this.context;
    const { pagination: { prev, next } } = this.props;

    return (
      <div className={style.pagination}>
        {prev && (
          <Link
            className={style.paginationLink}
            onClick={() => this.fetchPosts(prev)}
            leftIcon="angle-left"
          >
            {t('previous posts')}
          </Link>
        )}
        {next && (
          <Link
            className={style.paginationLink}
            onClick={() => this.fetchPosts(next)}
            rightIcon="angle-right"
          >
            {t('next posts')}
          </Link>
        )}
      </div>
    );
  }

  renderPosts() {
    const { t } = this.context;
    const { posts } = this.props;
    return posts.map(post => (
      <div key={post.id} className={style.post}>
        <div className={style.header}>
          <div className={style.releaseDate}>
            {t('Released on {releaseDate}', { releaseDate: formatDate(post.releasedAt) })}
          </div>
          <div className={style.title}>
            {post.pinned && <FaIcon className={style.pinnedIcon} icon="thumb-tack" />}
            {post.title}
          </div>
        </div>
        <div className={style.content}>
          {post.teaserImageUrl && (
            <img className={style.image} src={post.teaserImageUrl} alt={post.title} />
          )}
          {reactParser(post.content)}
        </div>
      </div>
    ));
  }

  render() {
    const { t } = this.context;
    const { posts } = this.props;

    return (
      <div className={style.container}>
        <div className={style.posts}>
          <h1>{t('News')}</h1>
          <div className={style.posts}>
            {posts.length > 0
              ? this.renderPosts()
              : t('Soon we will provide interesting news from us and our partners here.')}
          </div>
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  user: UserShape.isRequired,
  posts: PropTypes.arrayOf(PostShape),
  pagination: PropTypes.shape({
    size: PropTypes.number,
    first: PropTypes.number,
    next: PropTypes.number,
    self: PropTypes.number,
    prev: PropTypes.number,
    last: PropTypes.number,
  }),
};

Posts.contextTypes = {
  t: PropTypes.func.isRequired,
};

Posts.defaultProps = {
  posts: [],
  pagination: {
    size: null,
    page: 1,
  },
};

export default Posts;
