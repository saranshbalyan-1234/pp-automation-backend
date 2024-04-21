function autoIncrementV(schema, options) {
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

};

export default autoIncrementV;