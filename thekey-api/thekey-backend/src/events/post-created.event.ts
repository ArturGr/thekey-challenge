import { Post } from '../posts/post.dto';

export class PostCreatedEvent {
  constructor(
    public readonly post: Post,
    public readonly wordsMap: [string, number][],
  ) {}
}
