import { Connection as MongooseConnection } from 'mongoose';
import { Collection } from 'mongodb';
import mongoConnectionPromise from '../mongo.connection';
import ConsoleLogger from '../../console.logger';
import * as DatabaseConstants from '../constants';

async function initCollectionIndexes(collection: Collection): Promise<void> {
  // SINGLE INDEX
  await collection.createIndex({ price: 1 }, { background: true });
  await collection.createIndex({ pagesCount: 1 }, { background: true });
  await collection.createIndex({ publishedAt: 1 }, { background: true });
  await collection.createIndex({ language: 1 }, { background: true });
  // MULTIKEY INDEX
  await collection.createIndex({ tags: 1 }, { background: true });
  await collection.createIndex({ authors: 1 }, { background: true });
  await collection.createIndex({ genres: 1 }, { background: true });
}
async function main(): Promise<MongooseConnection> {
  const connection: MongooseConnection = await mongoConnectionPromise;

  ConsoleLogger.log('Started to init indexes, please wait...');

  await Promise.all([
    initCollectionIndexes(connection.db.collection(
      DatabaseConstants.FIRST_BOOKS_COLLECTION,
    )),
    initCollectionIndexes(connection.db.collection(
      DatabaseConstants.SECOND_BOOKS_COLLECTION,
    )),
  ]);

  return connection;
}

main().then(async (connection: MongooseConnection): Promise<void> => {
  await connection.close();
  ConsoleLogger.log('Indexes inited');
  process.exit(0);
}).catch((error): void => {
  ConsoleLogger.error(error);
  process.exit(1);
});
