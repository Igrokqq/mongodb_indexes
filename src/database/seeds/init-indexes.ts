import { Connection as MongooseConnection } from 'mongoose';
import { Collection } from 'mongodb';
import mongoConnectionPromise from '../mongo.connection';
import ConsoleLogger from '../../console.logger';

async function main(): Promise<void> {
  const mongooseConnection: MongooseConnection = await mongoConnectionPromise;
  const collection: Collection = mongooseConnection.db.collection('books');

  ConsoleLogger.log('Started to init indexes, please wait...');
  // SINGLE INDEX
  await collection.createIndex({ price: 1 }, { background: true });
  await collection.createIndex({ pagesCount: 1 }, { background: true });
  await collection.createIndex({ publishedAt: 1 }, { background: true });
  await collection.createIndex({ language: 1 }, { background: true });
  // MULTIKEY INDEX
  await collection.createIndex({ tags: 1 }, { background: true });
  await collection.createIndex({ authors: 1 }, { background: true });
  await collection.createIndex({ genres: 1 }, { background: true });

  await mongooseConnection.close();
}

main().then(() => {
  ConsoleLogger.log('Indexes inited');
  process.exit(0);
}).catch((error) => {
  ConsoleLogger.error(error);
  process.exit(1);
});
