import { useValidatedBody, z } from 'h3-zod';
import type { BookItem } from '~/queue/src/jobs';

export default defineEventHandler(async (event) => {
  const { url } = await useValidatedBody(
    event,
    z.object({
      url: z.string().trim().url()
    })
  );

  const pUrl = new URL(url);

  const match = /^\/shop\/home\/artikeldetails\/(?<key>A\d*)$/.exec(
    pUrl.pathname
  );

  if (
    !pUrl.hostname.endsWith('thalia.de') ||
    pUrl.protocol !== 'https:' ||
    !match ||
    !match.groups
  ) {
    throw createError({ status: 400, statusText: 'URL wrong' });
  }

  const key = match.groups.key;

  const bookStorage = useStorage('books');

  const exists = await bookStorage.hasItem(key);
  if (exists) {
    return { key };
  }

  console.log('adding new book', key, url);

  await bookStorage.setItem<BookItem>(key, {
    key,
    url: pUrl.href
  });

  await myQueue.upsertJobScheduler(
    `thalia-${key}`,
    // every 1h
    { every: 60 * 60 * 1000, immediately: true },
    {
      name: `thalia-${key}`,
      data: { key }
    }
  );

  return { key };
});
