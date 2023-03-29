import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { PostWordsUpdatedEvent } from '../events/post-words-updated.event';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostWordsController } from './post-words.controller';

describe('PostWordsController', () => {
  let controller: PostWordsController;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InMemoryDBModule.forFeature('post-words'),
        EventEmitterModule.forRoot(),
      ],
      controllers: [PostWordsController],
    }).compile();

    controller = module.get<PostWordsController>(PostWordsController);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create post words', () => {
    controller.createPostWordCount('test', 3)
    expect(controller.findAll()).toStrictEqual([{ id: 'test', count: 3 }]);
  });

  it('should update post words', () => {
    controller.createPostWordCount('test', 3)
    expect(controller.findAll()).toStrictEqual([{ id: 'test', count: 3 }]);
    controller.updatePostWordCount('test', 5)
    expect(controller.findAll()).toStrictEqual([{ id: 'test', count: 5 }]);
  });

  it('should increase post words', () => {
    controller.increasePostWordCount('test', 3)
    expect(controller.findAll()).toStrictEqual([{ id: 'test', count: 3 }]);
    controller.increasePostWordCount('test', 5)
    expect(controller.findAll()).toStrictEqual([{ id: 'test', count: 8 }]);
  });

  it('should handle post created event', async () => {
    const postCreatedEvent = new PostCreatedEvent(
      {
        id: '123',
        title: 'Test',
        content: 'Test content',
        status: 'publish',
        link: 'my.link/post',
        date_gmt: '11:22:33',
      },
      [
        ['word1', 2],
        ['word2', 5],
      ]
    )

    const savedWordsMap = [{ id: 'word1', count: 2 }, { id: 'word2', count: 5 }]

    const postWordsUpdatedEvent = jest.fn();
    eventEmitter.on('post_words_updated', postWordsUpdatedEvent);
    expect(eventEmitter.hasListeners('post_words_updated')).toBe(true);

    controller.handlePostCreatedEvent(postCreatedEvent);

    expect(controller.findAll()).toStrictEqual(savedWordsMap);
    expect(postWordsUpdatedEvent).toBeCalledWith(new PostWordsUpdatedEvent(savedWordsMap));
  });

});
