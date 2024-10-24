import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import type { ScrapeData } from './jobs.ts';

const connection = new IORedis({
  maxRetriesPerRequest: 0,
  password: process.env.NUXT_REDIS_PASSWORD
});
const myQueue = new Queue<ScrapeData>('scrape', { connection });

async function addJobs() {
  // await myQueue.add('myJobName', { foo: 'bar' });
  // await myQueue.add('myJobName', { qux: 'baz' }, {delay: 5*1000});
  console.log(await myQueue.getJobSchedulers(0, 9, true));
  await myQueue.removeJobScheduler('thalia-1');
  return;
  // await myQueue.upsertJobScheduler(
  //   'thalia-1',
  //   { every: 15_000, immediately: true },
  //   {
  //     name: 'thalia-1',
  //     data: { uri: '1' },
  //     opts: {
  //       // deduplication: {
  //       //   ttl: 25_000,
  //       //   id: 'thalia-1'
  //       // }
  //     }
  //   }
  // );
}

await addJobs();

await myQueue.close();
await connection.quit();
