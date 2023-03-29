import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PostsFetcherService } from './posts-fetcher.service';
const fetchMock = require('fetch-mock');
jest.mock('cross-fetch', () => {
  const testResponse = [
    {
      id: 123,
      title: { rendered: 'Test' },
      content: { rendered: 'Test content' },
      status: 'publish',
      link: 'my.link/post',
      date_gmt: '11:22:33',
    },
  ];
  const myMock = require('fetch-mock')
    .sandbox()
    .mock('https://www.thekey.academy/wp-json/wp/v2/posts', testResponse);
  return {
    __esModule: true,
    default: myMock,
  };
});

describe('PostsFetcherService', () => {
  let service: PostsFetcherService;
  let postProcessor: ClientProxy;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'POSTPROCESSOR',
            transport: Transport.TCP,
          },
        ]),
        EventEmitterModule.forRoot(),
      ],
      providers: [PostsFetcherService],
    }).compile();

    service = module.get<PostsFetcherService>(PostsFetcherService);
    postProcessor = module.get<ClientProxy>('POSTPROCESSOR');
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call handleNewPostsFetched with fetched posts', async () => {
    jest
      .spyOn(service, 'handleNewPostsFetched')
      .mockImplementationOnce(() => null);
    await service.fetchNewPosts();

    const testResponse = [
      {
        id: 123,
        title: { rendered: 'Test' },
        content: { rendered: 'Test content' },
        status: 'publish',
        link: 'my.link/post',
        date_gmt: '11:22:33',
      },
    ];

    expect(service.handleNewPostsFetched).toBeCalledWith(testResponse);
  });

  it('should send process post event', async () => {
    const testRawPost = {
      id: 123,
      title: { rendered: 'Test' },
      content: { rendered: 'Test content' },
      status: 'publish',
      link: 'my.link/post',
      date_gmt: '11:22:33',
    };
    const postProcessResult = {
      post: {
        id: '123',
        title: 'Test',
        content: 'Test content',
        status: 'publish',
        link: 'my.link/post',
        date_gmt: '11:22:33',
      },
      wordsMap: [
        ['word1', 2],
        ['word2', 5],
      ],
    };

    const sendMicroserviceEvent = jest.fn(() => of(postProcessResult));
    jest
      .spyOn(postProcessor, 'send')
      .mockImplementationOnce(sendMicroserviceEvent);

    const postProcessedEvent = jest.fn();
    eventEmitter.on('post_processed', postProcessedEvent);
    expect(eventEmitter.hasListeners('post_processed')).toBe(true);

    await service.handleNewPostsFetched([testRawPost]);

    expect(sendMicroserviceEvent).toBeCalledWith(
      { cmd: 'process_post' },
      { processPost: testRawPost },
    );
    expect(postProcessedEvent).toBeCalledWith(postProcessResult);
  });
});
