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
      const rawPost = await this.validateRawPost(data.processPost);
      if (!rawPost) return;

      const titleText = this.convertHtmlToText(rawPost.title.rendered);
      const titleWords = this.getWordsListFromText(titleText);

      const contentText = this.convertHtmlToText(rawPost.content.rendered);
      const contentWords = this.getWordsListFromText(contentText);

      const frequenciesByWord = this.countWordsFrequencies(
        titleWords,
        contentWords,
      );

      const id = String(rawPost.id);

      const post = new Post(
        id,
        titleText,
        contentText,
        rawPost.status,
        rawPost.link,
        rawPost.date_gmt,
      );

      return new PostProcessedResponse(post, [...frequenciesByWord.entries()]);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async validateRawPost(post: any): Promise<RawPost | undefined> {
    const postInstance = plainToInstance(RawPost, post);
    const validated = await validate(postInstance);
    if (validated.length > 0) {
      this.logger.error(JSON.stringify(validated));
      return undefined;
    }
    return postInstance;
  }

  convertHtmlToText(html: string) {
    const htmlToTextOptions: HtmlToTextOptions = {
      wordwrap: null,
      selectors: [
        {
          selector: 'h1',
          format: 'paragraph',
        },
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

    const text = convert(html, htmlToTextOptions, {
      ignoreHref: true,
    });
    return text;
  }

  getWordsListFromText(text: string) {
    const wordsList = text
      .split(/\s+/g)
      .map((word) =>
        word
          .replace(/(^\p{Punctuation}+)|(\p{Punctuation}+$)/gu, '')
          .toLowerCase(),
      )
      .filter(Boolean);
    return wordsList;
  }

  countWordsFrequencies(...wordLists: string[][]): Map<string, number> {
    const map = new Map<string, number>();
    wordLists.forEach((list) => {
      list.reduce((map, word) => map.set(word, (map.get(word) || 0) + 1), map);
    });
    return map;
  }
}
