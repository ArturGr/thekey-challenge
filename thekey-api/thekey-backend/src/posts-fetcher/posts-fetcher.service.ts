import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as URI from 'urijs';
import fetch from 'cross-fetch';
import { ClientProxy } from '@nestjs/microservices';
import { ProcessPostEvent } from '../events/process-post.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { first } from 'rxjs';

@Injectable()
export class PostsFetcherService {
  private readonly logger = new Logger(PostsFetcherService.name);
  private host = 'https://www.thekey.academy';
  private postsPath = 'wp-json/wp/v2/posts';
  private postsUrl = URI(this.host).pathname(this.postsPath).valueOf();

  constructor(
    @Inject('POSTPROCESSOR') private readonly postProcessorClient: ClientProxy,
    private eventEmitter: EventEmitter2,
  ) {}

  private loaded = false;
  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchNewPosts() {
    if (this.loaded) return;
    this.loaded = true;
    try {
      const postsBody = await fetch(this.postsUrl).then((r) => r.text());
      const posts = JSON.parse(postsBody);
      if (!Array.isArray(posts)) {
        this.logger.error(
          new Error(`Fetched /${this.postsPath} body is not an array.`),
        );
        return;
      }
      this.handleNewPostsFetched(posts);
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleNewPostsFetched(posts: any[]) {
    posts.forEach(async (post) => {
      this.postProcessorClient
        .send({ cmd: 'process_post' }, new ProcessPostEvent(post))
        .pipe(first())
        .subscribe((processed) => {
          this.eventEmitter.emit('post_processed', processed);
        });
    });
  }
}
