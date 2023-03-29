import { Post } from './postsAPI';
import postsReducer, {
  insertPost,
  insertPosts,
  PostsState,
} from './postsSlice';

describe('counter reducer', () => {
  const initialState: PostsState = {
    posts: {},
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual({
      posts: {},
      status: 'idle',
    });
  });

  it('should handle insert many posts', () => {
    const posts: Post[] = [{
      id: "123",
      title: "Test title",
      content: "Test content",
      link: "link.to/post",
      date_gmt: "11:11:11",
      status: 'publish'
    }, {
      id: "345",
      title: "Test title2",
      content: "Test content2",
      link: "link.to/post2",
      date_gmt: "22:22:22",
      status: 'draft'
    }];
    const actual = postsReducer(initialState, insertPosts(posts));
    expect(actual.posts['123'].title).toEqual("Test title")
    expect(actual.posts['123'].content).toEqual("Test content")
    expect(actual.posts['123'].link).toEqual("link.to/post")
    expect(actual.posts['123'].date_gmt).toEqual("11:11:11")
    expect(actual.posts['123'].status).toEqual("publish")

    expect(actual.posts['345'].title).toEqual("Test title2")
    expect(actual.posts['345'].content).toEqual("Test content2")
    expect(actual.posts['345'].link).toEqual("link.to/post2")
    expect(actual.posts['345'].date_gmt).toEqual("22:22:22")
    expect(actual.posts['345'].status).toEqual("draft")
  });

  it('should handle insert post', () => {
    const post: Post = {
      id: "123",
      title: "Test title",
      content: "Test content",
      link: "link.to/post",
      date_gmt: "11:11:11",
      status: 'publish'
    };
    const actual = postsReducer(initialState, insertPost(post));
    expect(actual.posts['123'].title).toEqual("Test title")
    expect(actual.posts['123'].content).toEqual("Test content")
    expect(actual.posts['123'].link).toEqual("link.to/post")
    expect(actual.posts['123'].date_gmt).toEqual("11:11:11")
    expect(actual.posts['123'].status).toEqual("publish")
  });
});
