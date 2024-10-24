import { BookItem } from '~/server/utils/queue';

export default defineEventHandler(async (event) => {
  const bookStorage = useStorage('books');
  const books = await bookStorage
    .getKeys()
    .then((keys) =>
      Promise.all(keys.map((key) => bookStorage.getItem<BookItem>(key)))
    );

  // console.log(await myQueue.getJobSchedulers(0, undefined, true));

  books.sort((a, b) => (a?.lastPrice || 0) - (b?.lastPrice || 0));

  return { books };
});
