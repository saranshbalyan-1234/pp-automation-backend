import mongoose from 'mongoose';

const BaseSchema = (schemaDefinition, schemaOptions) => {
  const schema = new mongoose.Schema({
    is_verified: { default: false, type: Boolean },
    ...schemaDefinition
  }, {
    optimisticConcurrency: true,
    strict: 'throw',
    timestamps: true,
    ...schemaOptions
  });

  schema.pre(/updateOne|updateMany|findOneAndUpdate/, function pre (next) {
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

  return schema;
};
export default BaseSchema;
