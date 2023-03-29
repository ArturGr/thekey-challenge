import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';

@Module({
  imports: [InMemoryDBModule.forFeature('posts')],
  controllers: [PostsController],
})
export class PostsModule {}
