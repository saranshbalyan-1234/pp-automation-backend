import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import autoIncrementV from '../../Mongo/Plugins/autoIncrementV.js'
const clientOption = {
  /*
   * SocketTimeoutMS: 30000,
   * ServerSelectionTimeoutMS:30000,
   */
  maxPoolSize: 5,
  minPoolSize:1
};
mongoose.set('debug', true);

// GLOBAL PLUGINS
mongoose.plugin(autoIncrementV)
mongoose.plugin(autopopulate);
  
// CONNECTION EVENTS
mongoose.connection.on('connected', () => console.success('connected'));
mongoose.connection.on('open', () => console.success('open'));
mongoose.connection.on('disconnected', () => console.log('disconnected'));
mongoose.connection.on('reconnected', () => console.log('reconnected'));
mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('close', () => console.log('close'));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close();
  console.log('Application crashed');
  process.exit(0);
});

export const createDbConnection = DB_URL => {
  try {
    return mongoose.connect(DB_URL, clientOption);
  } catch (error) {
    console.log('Error while connecting to DB', error);
  }
};
