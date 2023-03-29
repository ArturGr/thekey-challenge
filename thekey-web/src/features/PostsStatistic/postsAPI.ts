import { requestGET } from "../../API";

const postsPath = 'posts'

export function fetchPosts() {
  return requestGET<Post[]>(postsPath)
}

export type Post = {
  id: string;
  title: string;
  content: string;
  status: string;
  link: string;
  date_gmt: string;
}