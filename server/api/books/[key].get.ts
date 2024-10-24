import { useValidatedParams, z } from 'h3-zod';
import { BookItem } from '~/server/utils/queue';

export default defineEventHandler(async (event) => {
  const { key } = await useValidatedParams(
    event,
    z.object({
      key: z.string().min(1).trim()
    })
  );
  const bookStorage = useStorage('books');
  const book = await bookStorage.getItem<BookItem>(key);

  if (!book) {
    throw createError({ status: 404, statusText: 'Not Found' });
  }

  return book;
});
