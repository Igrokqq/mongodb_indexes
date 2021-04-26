import { createConnection, Connection, ConnectOptions } from 'mongoose';
import ConsoleLogger from '../console.logger';

type MongoConnectionContext = {
  _instance: Connection | undefined;
};

function MongoConnection(
  this: MongoConnectionContext,
  uri: string,
  options: ConnectOptions,
) {
  const _connect = async function (uri: string, options: ConnectOptions): Promise<Connection> {
    const connection: Connection = await createConnection(uri, options);
    connection.on('connected', () => ConsoleLogger.log(`Connected to ${uri}`));
    connection.on('connecting', () => ConsoleLogger.log(`Trying to connect to ${uri}`));
    connection.on('disconnected', () => ConsoleLogger.error(`Disconnected from ${uri}`));
    connection.on('disconnecting', () => ConsoleLogger.error(`Disconnecting from ${uri}`));

    return connection;
  };

  return {
    create: async (): Promise<Connection> => {
      if (!this._instance) {
        this._instance = await _connect(uri, options);
      }
      return this._instance;
    },
  };
}

export default new (MongoConnection as any)(process.env.MONGODB_URL || '', {
  // automatically try to reconnect when it loses connection
  autoReconnect: true,
  // reconnect every reconnectInterval milliseconds
  // for reconnectTries times
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  // flag to allow users to fall back to the old
  // parser if they find a bug in the new parse
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).create();
