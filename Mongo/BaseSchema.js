import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import autoIncrementV from './Plugins/autoIncrementV.js'

const BaseSchema = (schemaDefinition, schemaOptions) => {
  const schema = new mongoose.Schema({
    is_verified: { default: false, type: Boolean },
    ...schemaDefinition
  }, {
    optimisticConcurrency: true,
    strict: 'throw',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    ...schemaOptions
  });

  schema.plugin(autoIncrementV)
  schema.plugin(autopopulate);

  return schema;
};
export default BaseSchema;
