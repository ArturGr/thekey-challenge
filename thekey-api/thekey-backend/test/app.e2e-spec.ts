import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClientProxy } from '@nestjs/microservices';
import { PostsController } from '../src/posts/posts.controller';
import { PostWordsController } from '../src/post-words/post-words.controller';
import { first, Observable } from 'rxjs';
import { ProcessPostEvent } from '../src/events/process-post.event';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let postController: PostsController;
  let postWordsController: PostWordsController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    postController = moduleFixture.get<PostsController>(PostsController);
    postWordsController =
      moduleFixture.get<PostWordsController>(PostWordsController);

    app = moduleFixture.createNestApplication();
    await app.init();

    client = app.get('POSTPROCESSOR');
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it('(GET) /posts should return empty array', async () => {
    const reponse = await request(app.getHttpServer()).get('/posts');

    expect(reponse.status).toEqual(200);
    expect(reponse.body).toEqual([]);
  });

  it('(GET) /posts should return posts', async () => {
    const post = {
      id: '123',
      title: 'Test',
      content: 'Test content',
      status: 'publish',
      link: 'my.link/post',
      date_gmt: '11:22:33',
    };
    postController.createPost(post);
    const reponse = await request(app.getHttpServer()).get('/posts');
    expect(reponse.status).toEqual(200);
    expect(reponse.body).toEqual([post]);
  });

  it('(GET) /post-words should return empty array', async () => {
    const reponse = await request(app.getHttpServer()).get('/post-words');

    expect(reponse.status).toEqual(200);
    expect(reponse.body).toEqual([]);
  });

  it('(GET) /post-words should return post-words', async () => {
    postWordsController.createPostWordCount('test', 3);
    const reponse = await request(app.getHttpServer()).get('/post-words');
    expect(reponse.status).toEqual(200);
    expect(reponse.body).toEqual([{ id: 'test', count: 3 }]);
  });

  it('post-processor microservice should process post', (done) => {
    const testRawPost = {
      id: 123,
      title: { rendered: 'Test' },
      content: { rendered: 'Test content' },
      status: 'publish',
      link: 'https://www.thekey.link/post',
      date_gmt: '2023-01-02T13:37:58',
    };
    const postProcessResult = {
      post: {
        id: '123',
        title: 'Test',
        content: 'Test content',
        status: 'publish',
        link: 'https://www.thekey.link/post',
        date_gmt: '2023-01-02T13:37:58',
      },
      wordsMap: [
        ['test', 2],
        ['content', 1],
      ],
    };

    const response: Observable<any> = client.send(
      { cmd: 'process_post' },
      new ProcessPostEvent(testRawPost),
    );
    response.pipe(first()).subscribe(json => {
      expect(json).toStrictEqual(postProcessResult);

      done();
    });
  });
});
