import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import autoIncrementV from './Plugins/autoIncrementV.js'
import ArticleModel from './article.js'
const clientOption = {
  /*
   * SocketTimeoutMS: 30000,
   * ServerSelectionTimeoutMS:30000,
   */
  maxPoolSize: 5,
  minPoolSize:1
};
const connectionsObj = {}
mongoose.set('debug', true);

// GLOBAL PLUGINS
mongoose.plugin(autoIncrementV)
mongoose.plugin(autopopulate);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close();
  console.log('Application crashed');
  process.exit(0);
});

export const createDbConnection = (DB_URL, tenant = process.env.DATABASE_PREFIX+process.env.DATABASE_NAME) => {
  try {
    const conn = mongoose.createConnection(DB_URL, clientOption);
    registerAllSchema(conn)
    connectionEvents(conn)
    connectionsObj[tenant] = conn
    return conn;
  } catch (error) {
    console.log('Error while connecting to DB', error);
  }
};

const registerAllSchema = (db) => { 
  db.model("createConnection",ArticleModel)
}
const connectionEvents = (conn) => { 
conn.on('connected', () => console.success('connected'));
conn.on('open', () => console.log('open'));
conn.on('disconnected', () => console.error('disconnected'));
conn.on('reconnected', () => console.log('reconnected'));
conn.on('disconnecting', () => console.error('disconnecting'));
conn.on('close', () => console.log('close'));
}
 
export const getTenantDB = (tenant=process.env.DATABASE_PREFIX+process.env.DATABASE_NAME) => { 
   return connectionsObj[tenant]
}
  