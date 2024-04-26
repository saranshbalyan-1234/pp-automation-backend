import mongoose from 'mongoose';

const BaseSchema = (schemaDefinition, schemaOptions) => {
  const schema = new mongoose.Schema({
    ...schemaDefinition
  }, {
    optimisticConcurrency: true,
    strict: 'throw',
    timestamps:true,
    ...schemaOptions
  });

  return schema;
};
export default BaseSchema;
