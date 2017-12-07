import TestStore from '../orm-helper';

import {
  mapStateToProps,
  mapDispatchToProps,
  __RewireAPI__ as containerRewire,
} from '../../containers/posts';

describe('Posts Container', () => {
  describe('mapStateToProps', () => {
    let store;
    beforeEach(() => {
      store = new TestStore({ posts: {}, pagination: {} });
    });

    describe('mapStateToProps', () => {
      it('includes ordered posts', () => {
        const { factory, state } = store;
        const newPost = factory.create('post', { releasedAt: '2017-10-10' });
        const oldPost = factory.create('post', { releasedAt: '2017-02-01' });
        const oldPinnedPost = factory.create('post', { releasedAt: '2016-10-01', pinned: true });

        const props = mapStateToProps(state);
        const postsRefIds = props.posts.map(post => post.id);

        expect(postsRefIds).toHaveLength(3);
        expect(postsRefIds).toEqual([oldPinnedPost.id, newPost.id, oldPost.id]);
      });

      it('includes pages posts', () => {
        const { factory, state } = store;
        const newPost = factory.create('post', { releasedAt: '2017-10-10' });
        const oldPost = factory.create('post', { releasedAt: '2017-02-01' });
        const oldPinnedPost = factory.create('post', { releasedAt: '2016-10-01', pinned: true });

        const props = mapStateToProps(state);
        const postsRefIds = props.posts.map(post => post.id);

        expect(postsRefIds).toHaveLength(3);
        expect(postsRefIds).toEqual([oldPinnedPost.id, newPost.id, oldPost.id]);
      });

      it('includes user', () => {
        const { factory, state } = store;
        const user = factory.create('user');

        const props = mapStateToProps(state);
        expect(props.user).toEqual(user.includeRef);
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('fetchPosts', () => {
      const fetchPosts = () => 'fetchPosts';
      containerRewire.__Rewire__('fetchPosts', fetchPosts);

      const dispatch = action => action;
      const actions = mapDispatchToProps(dispatch);

      expect(actions.fetchPosts()).toEqual('fetchPosts');
    });
  });
});
