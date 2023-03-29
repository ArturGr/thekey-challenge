import { requestGET } from "../../API";

const postWordsPath = 'post-words'

export function fetchPostWordsCount() {
  return requestGET<WordCount[]>(postWordsPath)
}

export type WordCount = {
  id: string;
  count: number;
}