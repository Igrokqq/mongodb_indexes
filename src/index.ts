import { Model, Connection as MongooseConnection } from 'mongoose';
import { Collection } from 'mongodb';
import mongoConnectionPromise from './database/mongo.connection';
import { getModel as getBookModel, BookEntity } from './components/book/book.model';
import ConsoleLogger from './console.logger';

async function consoleQuerySpeedWithoutLean(model: Model<any>, limit: number): Promise<void> {
  ConsoleLogger.time('without lean');
  await model.find().limit(limit);
  ConsoleLogger.timeEnd('without lean');
}

async function consoleQuerySpeedWithLean(model: Model<any>, limit: number): Promise<void> {
  ConsoleLogger.time('with lean');
  await model.find().limit(limit).lean();
  ConsoleLogger.timeEnd('with lean');
}

async function consoleQuerySortSpeed(
  model: Model<any>,
  limit: number,
  sort: unknown,
): Promise<void> {
  ConsoleLogger.time('sort query with lean');
  await model.find().limit(limit).sort(sort).lean();
  ConsoleLogger.timeEnd('sort query with lean');
}

async function consoleQuerySearchInTags(
  collection: Collection,
  limit: number,
): Promise<void> {
  const consoleTimeId = 'search in tags query with lean';
  ConsoleLogger.time(consoleTimeId);
  await collection.aggregate([
    {
      $match: {
        tags: {
          // hardcoded because this string repeat in db
          $in: ['aut'],
        },
      },
    },
    {
      $limit: limit,
    },
  ]).toArray();
  ConsoleLogger.timeEnd(consoleTimeId);
}

async function consoleQuerySearchInGenres(
  collection: Collection,
  limit: number,
): Promise<void> {
  const consoleTimeId = 'search in genres query with lean';
  ConsoleLogger.time(consoleTimeId);
  await collection.aggregate([
    {
      $match: {
        genres: {
          // hardcoded because this string repeat in db
          $in: ['Pop'],
        },
      },
    },
    {
      $limit: limit,
    },
  ]).toArray();
  ConsoleLogger.timeEnd(consoleTimeId);
}

async function consoleQuerySearchInAuthors(
  collection: Collection,
  limit: number,
): Promise<void> {
  const consoleTimeId = 'search in authors query with lean';
  ConsoleLogger.time(consoleTimeId);
  await collection.aggregate([
    {
      $match: {
        authors: {
          // hardcoded because this string repeat in db
          $in: ['Ada Renner'],
        },
      },
    },
    {
      $limit: limit,
    },
  ]).toArray();
  ConsoleLogger.timeEnd(consoleTimeId);
}

async function main(): Promise<void> {
  const mongoConnection: MongooseConnection = await mongoConnectionPromise;
  const booksCollection: Collection = mongoConnection.db.collection('books');
  const BookModel: Model<BookEntity> = getBookModel(mongoConnection);
  const limit = 20000;

  ConsoleLogger.log('Don\'t worry, all works, you need to wait until this benchmark will finish');

  // CHECK WITH SIMPLE PLAIN JSON & WITH MONGOOSE LARGE OBJECT
  await consoleQuerySpeedWithoutLean(BookModel, limit);
  await consoleQuerySpeedWithLean(BookModel, limit);
  // CHECK WITH SINGLE INDEX AND WITHOUT
  ConsoleLogger.log('sort by price');
  await consoleQuerySortSpeed(BookModel, limit, { price: 1 });
  ConsoleLogger.log('sort by publishedAt');
  await consoleQuerySortSpeed(BookModel, limit, { publishedAt: 1 });
  ConsoleLogger.log('sort by pages count');
  await consoleQuerySortSpeed(BookModel, limit, { pagesCount: 1 });
  ConsoleLogger.log('sort by language');
  await consoleQuerySortSpeed(BookModel, limit, { language: 1 });
  // CHECK WITH MULTIKEY INDEX & WITHOUT
  await consoleQuerySearchInTags(booksCollection, limit);
  await consoleQuerySearchInGenres(booksCollection, limit);
  await consoleQuerySearchInAuthors(booksCollection, limit);

  await mongoConnection.close();
}

main().then(() => {
  process.exit(0);
}).catch((error) => {
  ConsoleLogger.error(error);
  process.exit(1);
});
