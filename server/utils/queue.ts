import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import type { ScrapeData } from '~/queue/src/jobs';

const { redisHost, redisPassword } = useRuntimeConfig();

const connection = new IORedis({
  maxRetriesPerRequest: 0,
  host: redisHost,
  password: redisPassword
});
export const myQueue = new Queue<ScrapeData>('scrape', { connection });

export type BookItem = {
  key: string;
  url: string;
  title?: string;
  author?: string;
  isbn?: string;
  image?: number;
  lastPrice?: number;
};
