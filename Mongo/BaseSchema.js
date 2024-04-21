import mongoose from 'mongoose';

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

  return schema;
};
export default BaseSchema;
