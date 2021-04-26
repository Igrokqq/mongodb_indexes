import { Connection as MongooseConnection } from 'mongoose';
import { UnorderedBulkOperation } from 'mongodb';
import mongoConnectionPromise from '../mongo.connection';
import bookEntityMock from '../mocks/book.entity.mock';
import ConsoleLogger from '../../console.logger';
import * as DatabaseConstants from '../constants';

async function main(): Promise<void> {
  const mongooseConnection: MongooseConnection = await mongoConnectionPromise;
  const documentsCount = 400_000;
  const bulkBooks1: UnorderedBulkOperation = mongooseConnection
    .collection(DatabaseConstants.FIRST_BOOKS_COLLECTION)
    .initializeUnorderedBulkOp();
  const bulkBooks2: UnorderedBulkOperation = mongooseConnection
    .collection(DatabaseConstants.SECOND_BOOKS_COLLECTION)
    .initializeUnorderedBulkOp();

  for (let iteration = 0; iteration < documentsCount; iteration += 1) {
    ConsoleLogger.log(`#${iteration} ${iteration + 1}`);
    bulkBooks1.insert(bookEntityMock());
    bulkBooks2.insert(bookEntityMock());
  }

  ConsoleLogger.log('Saving... Please wait');
  await Promise.all([bulkBooks1.execute(), bulkBooks2.execute()]);
  await mongooseConnection.close();
}

main().then(() => {
  ConsoleLogger.log('Seeded');
  process.exit(0);
}).catch((error) => {
  ConsoleLogger.error(error);
  process.exit(1);
});
