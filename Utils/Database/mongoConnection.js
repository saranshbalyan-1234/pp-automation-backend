import mongoose from 'mongoose';

const clientOption = {
  /*
   * SocketTimeoutMS: 30000,
   * ServerSelectionTimeoutMS:30000,
   */
  maxPoolSize: 5
};
mongoose.set('debug', true);
// CONNECTION EVENTS
mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connection.on('open', () => console.log('open'));
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
