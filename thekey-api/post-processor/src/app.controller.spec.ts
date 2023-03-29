import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessPostEvent } from './process-post.event';
import { PostProcessedResponse } from './post-processed-response';
import { Post } from './post.dto';
import { Logger } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
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

    appController = app.get<AppController>(AppController);
    logger = app.get<Logger>(Logger);
  });

  describe('root', () => {
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
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

      const result = await appController.handleProcessPost(
        new ProcessPostEvent(testRawPost),
      );
      expect(result).toStrictEqual(undefined);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
