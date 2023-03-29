import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { PostWordsController } from './post-words.controller';

@Module({
  imports: [InMemoryDBModule.forFeature('post-words')],
  controllers: [PostWordsController],
})
export class PostWordsModule {}
