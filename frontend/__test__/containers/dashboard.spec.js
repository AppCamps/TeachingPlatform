import TestStore from '../orm-helper';

import { mapStateToProps } from '../../containers/dashboard';

describe('Dashboard Container', () => {
  describe('mapStateToProps', () => {
    let store;
    beforeEach(() => {
      store = new TestStore({ posts: {}, pagination: {} });
    });

    describe('mapStateToProps', () => {
      it('includes ownProps.location', () => {
        const { factory, state } = store;
        factory.create('user', { unreadPostsPresent: true });

        const props = mapStateToProps(state, { location: '/test' });
        expect(props.router).toEqual('/test');
      });

      it('includes unreadPostsPresent', () => {
        const { factory, state } = store;
        factory.create('user', { unreadPostsPresent: true });

        const props = mapStateToProps(state, {});
        expect(props.unreadPostsPresent).toEqual(true);
      });
    });
  });
});
