import { PostWordEntity } from 'src/post-words/post-word.entity';
export class PostWordsUpdatedEvent {
  constructor(public readonly postWords: PostWordEntity[]) {}
}
