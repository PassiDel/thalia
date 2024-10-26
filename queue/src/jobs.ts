export type ScrapeData = { key: string };

export type BookItem = {
  key: string;
  url: string;
  title?: string;
  author?: string;
  isbn?: string;
  image?: number;
  lastPrice?: number;
};
