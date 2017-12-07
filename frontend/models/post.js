import PropTypes from 'prop-types';
import { attr } from 'redux-orm';

import BaseModel from '.';

class Post extends BaseModel {}
Post.modelName = 'Post';

Post.fields = {
  ...BaseModel.fields,
  id: attr(),
  title: attr(),
  content: attr(),
  teaserImageUrl: attr(),
  releasedAt: attr(),
  pinned: attr(),
};

Post.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  title: '',
  content: '',
  teaserImageUrl: null,
  pinned: false,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  teaserImageUrl: PropTypes.string,
  releasedAt: PropTypes.string,
  pinned: PropTypes.boolean,
});

export default Post;
export { Shape };
