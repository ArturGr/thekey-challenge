import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface PostEntity extends InMemoryDBEntity {
  title: string;
  content: string;
  status: string;
  link: string;
  date_gmt: string;
}
