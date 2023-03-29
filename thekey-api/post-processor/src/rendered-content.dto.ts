import { IsString } from 'class-validator';

export class RenderedContent {
  @IsString()
  rendered: string;
}
