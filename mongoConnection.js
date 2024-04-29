import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

import { getDirectories } from '#utils/file.js';

const clientOption = {
  /*
   * SocketTimeoutMS: 30000,
   * ServerSelectionTimeoutMS:30000,
   */
  maxPoolSize: 5,
  minPoolSize: 1
};
const connectionsObj = {};
// Mongoose.set('debug', true);

const registerAllPlugins = () => {
  mongoose.plugin(autopopulate);
  getDirectories('.', 'plugin', (err, res) => {
    if (err) {
      console.e('Error', err);
    } else {
      res.forEach(async element => {
        const schema = await import(element);
        const defaultFile = schema.default;
        mongoose.plugin(defaultFile);
      });
    }
  });
};

registerAllPlugins();

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close();
  console.log('Application crashed');
  process.exit(0);
});

export const createDbConnection = (DB_URL = '', tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) => {
  try {
    const conn = mongoose.createConnection(DB_URL.at(-1) === '/' ? DB_URL : `${DB_URL}/${tenant}`, clientOption);
    registerAllSchema(conn);
    connectionEvents(conn);
    connectionsObj[tenant] = conn;
    return conn;
  } catch (error) {
    console.log('Error while connecting to DB', error);
  }
};

const registerAllSchema = (db) => {
  getDirectories('.', 'schema', (err, res) => {
    if (err) {
      console.e('Error', err);
    } else {
      res.forEach(async element => {
        const schema = await import(element);
        const defaultFile = schema.default;
        const tempAr = element.split('.');
        const name = tempAr[tempAr.length - 3].split('/')[tempAr.length - 1];
        db.model(name.toLowerCase(), defaultFile);
      });
    }
  });
};

const connectionEvents = (conn) => {
  conn.on('connected', () => console.success('connected'));
  conn.on('open', () => console.log('open'));
  conn.on('disconnected', () => console.error('disconnected'));
  conn.on('reconnected', () => console.log('reconnected'));
  conn.on('disconnecting', () => console.error('disconnecting'));
  conn.on('close', () => console.log('close'));
};

export const getTenantDB = (tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) => connectionsObj[tenant];
