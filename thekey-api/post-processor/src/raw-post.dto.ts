import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { RenderedContent } from './rendered-content.dto';

export class RawPost {
  @IsInt()
  id: number;

  @ValidateNested()
  @Type(() => RenderedContent)
  title: { rendered: string };

  @ValidateNested()
  @Type(() => RenderedContent)
  content: { rendered: string };

  @IsString()
  status: string;

  @IsUrl()
  link: string;

  @IsDateString()
  date_gmt: string;
}
