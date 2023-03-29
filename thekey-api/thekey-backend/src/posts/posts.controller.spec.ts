import { InMemoryDBModule, InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostProcessedResponse } from './post-processed-response';
import { PostEntity } from './post.entity';
import { PostsController } from './posts.controller';

describe('PostController', () => {
  let controller: PostsController;
  let eventEmitter: EventEmitter2;
  let postsService: InMemoryDBService<PostEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InMemoryDBModule.forFeature('posts'),
        EventEmitterModule.forRoot(),
      ],
      controllers: [PostsController],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    postsService = module.get<InMemoryDBService<PostEntity>>(InMemoryDBService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should create post after process', async () => {
    const postProcessResult = new PostProcessedResponse(
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

    const postCreatedEvent = jest.fn();
    eventEmitter.on('post_created', postCreatedEvent);
    expect(eventEmitter.hasListeners('post_created')).toBe(true);

    controller.handlePostProcessedEvent(postProcessResult);

    const posts = controller.findAll();
    expect(posts).toStrictEqual([postProcessResult.post]);
    expect(postCreatedEvent).toBeCalledWith(new PostCreatedEvent(postProcessResult.post, postProcessResult.wordsMap));
  });

  it('should return posts', () => {
    const post = {
      id: '123',
      title: 'Test',
      content: 'Test content',
      status: 'publish',
      link: 'my.link/post',
      date_gmt: '11:22:33',
    }
    controller.createPost(post)
    expect(controller.findAll()).toStrictEqual([post]);
  });

});
