import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
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

  // Version update
  schema.pre(/updateOne|updateMany|findOneAndUpdate/, function autoIncrementV (next) {
    const isVersionModified = this.getUpdate().$set.__v;
    if (isVersionModified) return next();
    try {
      this.getUpdate().$inc = { __v: 1 };
      next();
    } catch (error) {
      console.log('Error in global preupdate hook', error);
      return next(error);
    }
  });

  schema.plugin(autopopulate);

  return schema;
};
export default BaseSchema;
