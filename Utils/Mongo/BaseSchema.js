import mongoose from 'mongoose';

const BaseSchema = (schemaDefinition, schemaOptions) =>
  new mongoose.Schema(
    {
      ...schemaDefinition
    },
    {
      optimisticConcurrency: true,
      strict: 'throw',
      timestamps: true,
      ...schemaOptions
    }
  );
export default BaseSchema;
