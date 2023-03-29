import {
  InjectInMemoryDBService,
  InMemoryDBEntityAsyncController,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Controller, Get, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostProcessedResponse } from './post-processed-response';
import { Post } from './post.dto';
import { PostEntity } from './post.entity';

@Controller('posts')
export class PostsController extends InMemoryDBEntityAsyncController<PostEntity> {
  private readonly logger = new Logger(PostsController.name);

  constructor(
    @InjectInMemoryDBService('posts')
    private postService: InMemoryDBService<PostEntity>,
    private eventEmitter: EventEmitter2,
  ) {
    super(postService);
  }

  createPost(createPost: Post) {
    return this.postService.create(createPost);
  }

  @OnEvent('post_processed')
  handlePostProcessedEvent(payload: PostProcessedResponse) {
    if (!this.postService.get(payload.post.id)) {
      try {
        const post = this.createPost(payload.post);
        this.eventEmitter.emit(
          'post_created',
          new PostCreatedEvent(post, payload.wordsMap),
        );
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  @Get()
  findAll() {
    return this.postService.getAll();
  }
}
