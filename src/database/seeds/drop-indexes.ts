import { Connection } from 'mongoose';
import { Collection } from 'mongodb';
import ConsoleLogger from '../../console.logger';
import * as DatabaseConstants from '../constants';
import mongooseConnectionPromise from '../mongo.connection';

async function _dropCollectionIndexIfExists(
  collection: Collection,
  indexName: string,
): Promise<void> {
  const exists: boolean = await collection.indexExists(indexName);

  if (exists) {
    await collection.dropIndex(indexName);
  }
}

async function dropCollectionIndexes(collection: Collection): Promise<void> {
  // SINGLE INDEX
  await _dropCollectionIndexIfExists(collection, 'cat_1');
  await _dropCollectionIndexIfExists(collection, 'pagesCount_1');
  await _dropCollectionIndexIfExists(collection, 'publishedAt_1');
  await _dropCollectionIndexIfExists(collection, 'language_1');
  await _dropCollectionIndexIfExists(collection, 'price_1');
  // MULTIKEY INDEX
  await _dropCollectionIndexIfExists(collection, 'tags_1');
  await _dropCollectionIndexIfExists(collection, 'authors_1');
  await _dropCollectionIndexIfExists(collection, 'genres_1');
}

async function main(): Promise<Connection> {
  const connection: Connection = await mongooseConnectionPromise;
  ConsoleLogger.log('Started to init indexes, please wait...');
  await dropCollectionIndexes(connection.db.collection(DatabaseConstants.FIRST_BOOKS_COLLECTION));
  await dropCollectionIndexes(connection.db.collection(DatabaseConstants.SECOND_BOOKS_COLLECTION));

  return connection;
}

main().then(async (connection: Connection): Promise<void> => {
  await connection.close();
  ConsoleLogger.log('Indexes were removed');
  process.exit(0);
}).catch((error): void => {
  ConsoleLogger.error(error);
  process.exit(1);
});
