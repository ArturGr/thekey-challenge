import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessPostEvent } from './process-post.event';
import { PostProcessedResponse } from './post-processed-response';
import { Post } from './post.dto';
import { Logger } from '@nestjs/common';
import { RawPost } from './raw-post.dto';
import { RenderedContent } from './rendered-content.dto';

describe('AppController', () => {
  let appService: AppService;
  let logger: Logger;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        AppService,
      ],
      controllers: [AppController],
    }).compile();

    appService = app.get<AppService>(AppService);
    logger = app.get<Logger>(Logger);
  });

  it('should validate post', async () => {
    const testRawPost = {
      id: 23456,
      title: { rendered: 'Test' },
      content: { rendered: 'Test content for test [ConTent].' },
      status: 'publish',
      link: 'https://www.thekey.link/post',
      date_gmt: '2023-01-02T13:37:58',
    };

    const renderedTitle = new RenderedContent();
    renderedTitle.rendered = 'Test';

    const renderedContent = new RenderedContent();
    renderedContent.rendered = 'Test content for test [ConTent].';

    const validatedPost = new RawPost();
    validatedPost.id = 23456;
    validatedPost.title = renderedTitle;
    validatedPost.content = renderedContent;
    validatedPost.status = 'publish';
    validatedPost.link = 'https://www.thekey.link/post';
    validatedPost.date_gmt = '2023-01-02T13:37:58';

    const result = await appService.validateRawPost(testRawPost);
    expect(result).toStrictEqual(validatedPost);
    expect(logger.error).toHaveBeenCalledTimes(0);
  });

  it('should convert html to text', async () => {
    const html = `<!DOCTYPE html>
    <html><body>
    <h1>My test title</h1>
    <p>This is a good test.</p>
    </body>
    </html>`;

    const text = 'My test title\n\nThis is a good test.';

    const result = appService.convertHtmlToText(html);
    expect(result).toStrictEqual(text);
  });

  it('should get words list from text', async () => {
    const text = 'My test title\n\nThis is a good test.';
    const wordsList = [
      'my',
      'test',
      'title',
      'this',
      'is',
      'a',
      'good',
      'test',
    ];

    const result = appService.getWordsListFromText(text);
    expect(result).toStrictEqual(wordsList);
  });

  it('should count word frequency', async () => {
    const wordsList1 = ['my', 'test', 'title'];
    const wordsList2 = ['this', 'is', 'a', 'good', 'test'];

    const wordsMap = new Map([
      ['my', 1],
      ['test', 2],
      ['title', 1],
      ['this', 1],
      ['is', 1],
      ['a', 1],
      ['good', 1]
    ]);

    const result = appService.countWordsFrequencies(wordsList1, wordsList2);
    expect(result).toStrictEqual(wordsMap);
  });

   it('should process post', async () => {
     const testRawPost = {
       id: 123,
       title: { rendered: 'Test' },
       content: { rendered: 'Test content for test [ConTent].' },
       status: 'publish',
       link: 'https://www.thekey.link/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const postProcessResult = new PostProcessedResponse(
       new Post(
         '123',
         'Test',
         'Test content for test [ConTent].',
         'publish',
         'https://www.thekey.link/post',
         '2023-01-02T13:37:58',
       ),
       [
         ['test', 3],
         ['content', 2],
         ['for', 1],
       ],
     );
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(postProcessResult);
   });
 
   it('should validate post id before processing', async () => {
     const testRawPost = {
       id: '23456',
       title: { rendered: 'Test' },
       content: { rendered: 'Test content for test [ConTent].' },
       status: 'publish',
       link: 'https://www.thekey.link/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
 
   it('should validate post title before processing', async () => {
     const testRawPost = {
       id: 123,
       title: 'test',
       content: { rendered: 'Test content for test [ConTent].' },
       status: 'publish',
       link: 'https://www.thekey.link/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
 
   it('should validate post content before processing', async () => {
     const testRawPost = {
       id: 123,
       title: { rendered: 'Test' },
       content: 'Test content for test [ConTent].',
       status: 'publish',
       link: 'https://www.thekey.link/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
 
   it('should validate post status before processing', async () => {
     const testRawPost = {
       id: 123,
       title: { rendered: 'Test' },
       content: { rendered: 'Test content for test [ConTent].' },
       link: 'https://www.thekey.link/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
 
   it('should validate post link before processing', async () => {
     const testRawPost = {
       id: 123,
       title: { rendered: 'Test' },
       content: { rendered: 'Test content for test [ConTent].' },
       status: 'publish',
       link: 'https://www/post',
       date_gmt: '2023-01-02T13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
 
   it('should validate post date before processing', async () => {
     const testRawPost = {
       id: 123,
       title: { rendered: 'Test' },
       content: { rendered: 'Test content for test [ConTent].' },
       status: 'publish',
       link: 'https://www.thekey.link/post',
       date_gmt: '13:37:58',
     };
 
     const result = await appService.handleProcessPost(
       new ProcessPostEvent(testRawPost),
     );
     expect(result).toStrictEqual(undefined);
     expect(logger.error).toHaveBeenCalled();
   });
});
