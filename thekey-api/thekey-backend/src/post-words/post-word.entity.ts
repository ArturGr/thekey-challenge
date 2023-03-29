import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface PostWordEntity extends InMemoryDBEntity {
  count: number;
}
