import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { first, Observable } from 'rxjs';
import { ProcessPostEvent } from '../src/process-post.event';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ClientsModule.register([
        { name: 'THEKEYBACKEND', transport: Transport.TCP },
      ])],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP,
    });

    app.startAllMicroservices()
    await app.init();

    client = app.get('THEKEYBACKEND');
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it('should process post', (done) => {
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
