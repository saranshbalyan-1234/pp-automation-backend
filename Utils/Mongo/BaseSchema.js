import mongoose from 'mongoose';

const BaseSchema = (schemaDefinition, schemaOptions) =>
  new mongoose.Schema(
    {
      ...schemaDefinition,
      createdAt: {
        immutable: true,
        type: Date
      }
    },
    {
      optimisticConcurrency: true,
      strict: 'throw',
      timestamps: true,
      ...schemaOptions
    }
  );
export default BaseSchema;
