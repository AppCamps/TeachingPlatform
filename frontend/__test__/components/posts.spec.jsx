import React from 'react';

import { shallow } from 'enzyme';
import factory from '../__factories__';

import Posts from '../../components/posts';
import { t } from '../../utils/translations';

describe('<Posts />', () => {
  const posts = factory.buildList('post', 2);

  const fetchPosts = () => true;
  const defaultProps = {
    posts,
    fetchPosts,
  };

  it('matches snapshot', () => {
    const wrapper = shallow(
      <Posts
        {...defaultProps}
        posts={[
          {
            id: '12345',
            title: 'Title 1',
            content: '<span>hi!</span>',
            releasedAt: '2017-07-06T08:45:27.188Z',
          },
          {
            id: '56789',
            title: 'Title 2',
            content: 'Hmmm...',
            teaserImageUrl: 'https://img.test/',
            releasedAt: '2017-11-06T15:05:27.188Z',
          },
        ]}
      />,
      {
        context: {
          t,
        },
      },
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchPosts on mount', () => {
    const fetchPostsMock = jest.fn();
    shallow(<Posts {...defaultProps} fetchPosts={fetchPostsMock} />, {
      context: { t },
    });

    expect(fetchPostsMock.mock.calls).toHaveLength(1);
  });

  it('renders the posts', () => {
    const wrapper = shallow(<Posts {...defaultProps} />, {
      context: {
        t,
      },
    });

    const postElements = wrapper.find('.post');
    expect(postElements).toHaveLength(2);

    posts.forEach((post, index) => {
      const postElement = postElements.at(index);
      const releaseDate = `${post.releasedAt.getDate()}.${post.releasedAt.getMonth() +
        1}.${post.releasedAt.getFullYear()}`;

      expect(postElement.find('.title').text()).toEqual(posts[index].title);
      expect(postElement.find('.content').text()).toEqual(posts[index].content);
      expect(postElement.find('img').prop('src')).toEqual(posts[index].teaserImageUrl);
      expect(postElement.find('.releaseDate').text()).toEqual(`Released on ${releaseDate}`);
    });
  });

  describe('page navigation', () => {
    it('renders prev link', () => {
      const fetchPostsMock = jest.fn();
      const user = factory.build('user');
      const wrapper = shallow(
        <Posts
          {...defaultProps}
          user={user}
          pagination={{ prev: 1, size: 3 }}
          fetchPosts={fetchPostsMock}
        />,
        {
          context: { t },
        },
      );

      expect(fetchPostsMock.mock.calls).toHaveLength(1);

      expect(wrapper.find('.paginationLink')).toHaveLength(1);
      const prevLink = wrapper.find('.paginationLink').at(0);

      expect(prevLink.render().text()).toEqual('previous posts');

      prevLink.simulate('click');

      expect(fetchPostsMock.mock.calls).toHaveLength(2);
      expect(fetchPostsMock).lastCalledWith({ number: 1, size: 3 }, user);
    });

    it('renders next link', () => {
      const fetchPostsMock = jest.fn();
      const user = factory.build('user');
      const wrapper = shallow(
        <Posts
          {...defaultProps}
          user={user}
          pagination={{ next: 3, size: 2 }}
          fetchPosts={fetchPostsMock}
        />,
        {
          context: { t },
        },
      );

      expect(fetchPostsMock.mock.calls).toHaveLength(1);

      expect(wrapper.find('.paginationLink')).toHaveLength(1);
      const prevLink = wrapper.find('.paginationLink').at(0);

      expect(prevLink.render().text()).toEqual('next posts');

      prevLink.simulate('click');

      expect(fetchPostsMock.mock.calls).toHaveLength(2);
      expect(fetchPostsMock).lastCalledWith({ number: 3, size: 2 }, user);
    });
  });
});
