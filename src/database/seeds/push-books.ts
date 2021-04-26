import { Connection as MongooseConnection } from 'mongoose';
import { UnorderedBulkOperation } from 'mongodb';
import mongoConnectionPromise from '../mongo.connection';
import bookEntityMock from '../mocks/book.entity.mock';
import ConsoleLogger from '../../console.logger';

const chunkSize = 1000;
const documentsCount = 1_000_000;

async function main(): Promise<void> {
  const mongooseConnection: MongooseConnection = await mongoConnectionPromise;
  const iterationsCount: number = documentsCount / chunkSize;
  const bulk: UnorderedBulkOperation = mongooseConnection.collection('books').initializeUnorderedBulkOp();

  for (let iteration = 0; iteration < iterationsCount; iteration += 1) {
    ConsoleLogger.log(`#${iteration} ${chunkSize * (iteration + 1)}`);
    for (let b = 0; b < chunkSize; b += 1) {
      bulk.insert(bookEntityMock());
    }
  }

  ConsoleLogger.log('Saving... Please wait');
  await bulk.execute();
  await mongooseConnection.close();
}

main().then(() => {
  ConsoleLogger.log('Seeded');
  process.exit(0);
}).catch((error) => {
  ConsoleLogger.error(error);
  process.exit(1);
});
