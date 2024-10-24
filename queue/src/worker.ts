import { Worker } from 'bullmq';
import { parseFromString } from 'dom-parser';
import IORedis from 'ioredis';
import type { BookItem } from '../../server/utils/queue.ts';
import type { ScrapeData } from './jobs.ts';

const connection = new IORedis({
  maxRetriesPerRequest: 0,
  password: process.env.NUXT_REDIS_PASSWORD
});

const worker = new Worker<ScrapeData>(
  'scrape',
  async (job) => {
    console.log('Start', job.data);
    const key = `books:${job.data.key}`;
    const data = await connection
      .get(key)
      .then((s) => JSON.parse(s || '{}') as BookItem);

    const html = await fetch('http://localhost:8191/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd: 'request.get',
        url: data.url,
        maxTimeout: 60000
      })
    })
      .then((b) => b.json())
      .then((r) => r.solution.response);

    const doc3 = parseFromString(html);
    const obj = Object.fromEntries(
      [...doc3.getElementsByTagName('meta')].map((e) => [
        e.getAttribute('name') || e.getAttribute('property'),
        e.getAttribute('content')
      ])
    );

    const { title, author, type, isbn } =
      /^'(?<title>.*)' von '(?<author>.*)' - (?<type>.*) - '(?<isbn>.*)'$/.exec(
        obj['og:title']
      )!!.groups!!;

    const price = parseFloat(obj['product:price:amount']);
    const image = obj['og:image'];

    const newData = {
      ...data,
      title,
      author,
      isbn,
      image,
      lastPrice: price
    };

    await connection.set(key, JSON.stringify(newData));
    console.log('End', job.data, newData);
  },
  { connection, concurrency: 2 }
);

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
