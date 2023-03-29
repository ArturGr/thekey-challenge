import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Controller, Get } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostWordsUpdatedEvent } from '../events/post-words-updated.event';
import { PostWordEntity } from './post-word.entity';

@Controller('post-words')
export class PostWordsController {
  constructor(
    @InjectInMemoryDBService('post-words')
    private postWordsService: InMemoryDBService<PostWordEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  createPostWordCount(word: string, count: number) {
    return this.postWordsService.create({ id: word, count });
  }

  updatePostWordCount(word: string, count: number) {
    return this.postWordsService.update({ id: word, count });
  }

  increasePostWordCount(word: string, count: number) {
    const currentPostWord = this.postWordsService.get(word);
    if (!currentPostWord) {
      return this.createPostWordCount(word, count);
    }
    const newCount = currentPostWord.count + count;
    return this.updatePostWordCount(word, newCount);
  }

  @OnEvent('post_created')
  async handlePostCreatedEvent(payload: PostCreatedEvent) {
    const wordsMap = new Map(payload.wordsMap);
    wordsMap.forEach((count, word) => {
      this.increasePostWordCount(word, count);
    });
    this.eventEmitter.emit(
      'post_words_updated',
      new PostWordsUpdatedEvent(this.postWordsService.getAll()),
    );
  }

  @Get()
  findAll() {
    return this.postWordsService.getAll();
  }
}
