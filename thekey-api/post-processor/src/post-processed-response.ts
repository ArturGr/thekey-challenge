import { Post } from './post.dto';

export class PostProcessedResponse {
  constructor(
    public readonly post: Post,
    public readonly wordsMap: [string, number][],
  ) {}
}
