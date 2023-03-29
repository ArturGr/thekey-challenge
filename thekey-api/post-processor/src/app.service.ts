import { Injectable, Logger } from '@nestjs/common';
import { ProcessPostEvent } from './process-post.event';
import { convert, HtmlToTextOptions } from 'html-to-text';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RawPost } from './raw-post.dto';
import { PostProcessedResponse } from './post-processed-response';
import { Post } from './post.dto';

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {}

  async handleProcessPost(
    data: ProcessPostEvent,
  ): Promise<PostProcessedResponse> {
    try {
      const postInstance = plainToInstance(RawPost, data.processPost);
      const validated = await validate(postInstance);
      if (validated.length > 0) {
        this.logger.error(JSON.stringify(validated));
        return undefined;
      }

      const htmlToTextOptions: HtmlToTextOptions = {
        wordwrap: null,
        selectors: [
          {
            selector: 'a',
            format: 'paragraph',
          },
          {
            selector: 'img',
            format: 'skip',
          },
        ],
      };

      const titleHtml = postInstance.title.rendered;
      const titleText = convert(titleHtml, htmlToTextOptions, {
        ignoreHref: true,
      });

      const titleWords = titleText
        .split(/\s+/g)
        .map((word) =>
          word
            .replace(/(^\p{Punctuation}+)|(\p{Punctuation}+$)/gu, '')
            .toLowerCase(),
        )
        .filter(Boolean);

      const contentHtml = postInstance.content.rendered;
      const contentText = convert(contentHtml, htmlToTextOptions, {
        ignoreHref: true,
      });

      const contentWords = contentText
        .split(/\s+/g)
        .map((word) =>
          word
            .replace(/(^\p{Punctuation}+)|(\p{Punctuation}+$)/gu, '')
            .toLowerCase(),
        )
        .filter(Boolean);

      const titleFrequenciesByWord = titleWords.reduce(
        (map, word) => map.set(word, (map.get(word) || 0) + 1),
        new Map<string, number>(),
      );
      const frequenciesByWord = contentWords.reduce(
        (map, word) => map.set(word, (map.get(word) || 0) + 1),
        titleFrequenciesByWord,
      );

      const id = String(postInstance.id);

      const post = new Post(
        id,
        titleText,
        contentText,
        postInstance.status,
        postInstance.link,
        postInstance.date_gmt,
      );

      return new PostProcessedResponse(post, [...frequenciesByWord.entries()]);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
}
