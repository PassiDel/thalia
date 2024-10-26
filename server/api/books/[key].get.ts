import { useValidatedParams, z } from 'h3-zod';
import type { BookItem } from '~/queue/src/jobs';
import { influxDB } from '~/server/utils/influx';

export default defineEventHandler(async (event) => {
  const { key } = await useValidatedParams(
    event,
    z.object({
      key: z.string().min(1).trim()
    })
  );
  const bookStorage = useStorage('books');
  const book = await bookStorage.getItem<BookItem>(key);

  // TODO: add influx graph
  const { influxBucket, influxOrg } = useRuntimeConfig(event);
  influxDB.getQueryApi(influxOrg);

  if (!book) {
    throw createError({ status: 404, statusText: 'Not Found' });
  }

  return book;
});
