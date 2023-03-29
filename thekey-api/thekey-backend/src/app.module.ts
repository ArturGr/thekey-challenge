import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsFetcherService } from './posts-fetcher/posts-fetcher.service';
import { ScheduleModule } from '@nestjs/schedule';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PostsModule } from './posts/posts.module';
import { PostWordsModule } from './post-words/post-words.module';
import { SocketsModule } from './sockets/sockets.module';

@Module({
  imports: [
    InMemoryDBModule.forRoot(),
    ClientsModule.register([
      {
        name: 'POSTPROCESSOR',
        transport: Transport.TCP,
      },
    ]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PostsModule,
    PostWordsModule,
    SocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostsFetcherService],
})
export class AppModule {}
