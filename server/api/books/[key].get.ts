import { subDays } from 'date-fns';
import { useValidatedParams, useValidatedQuery, z } from 'h3-zod';
import type { BookItem } from '~/queue/src/jobs';
import { getBookData } from '~/server/utils/influx';

export const ufoDate = z
  .string()
  .optional()
  .transform((t) =>
    t && t.charAt(0) === '"' && t.charAt(t.length - 1) === '"'
      ? t.substring(1, t.length - 1)
      : t
  )
  .superRefine((s, ctx) => {
    const parse = z.string().datetime().optional().safeParse(s);
    if (!parse.success) {
      parse.error.errors.forEach((e) => ctx.addIssue(e));
    }
  });

export default defineEventHandler(async (event) => {
  const { key } = await useValidatedParams(
    event,
    z.object({
      key: z.string().min(1).trim()
    })
  );
  const { start, end } = await useValidatedQuery(
    event,
    z.object({
      start: ufoDate.default(subDays(new Date(), 14).toISOString()),
      end: ufoDate.default(new Date().toISOString())
    })
  );

  const bookStorage = useStorage('books');
  const book = await bookStorage.getItem<BookItem>(key);

  if (!book) {
    throw createError({ status: 404, statusText: 'Not Found' });
  }

  const { influxBucket } = useRuntimeConfig(event);

  const query = `from(bucket: "${influxBucket}")
 |> range(start: ${start}, stop: ${end})
  |> filter(fn: (r) => r["_measurement"] == "book")
  |> filter(fn: (r) => r["_field"] == "price")
  |> filter(fn: (r) => r["key"] == "books:${key}")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)`;

  // TODO: add some caching
  const data = await getBookData(query);

  return { book, data };
});
