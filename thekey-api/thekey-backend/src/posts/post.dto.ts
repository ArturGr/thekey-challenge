export class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly status: string,
    public readonly link: string,
    public readonly date_gmt: string,
  ) {}
}
