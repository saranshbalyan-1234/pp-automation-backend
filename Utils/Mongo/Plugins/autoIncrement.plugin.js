const autoIncrementV = function autoIncrementV (schema) {
  // Version update
  schema.pre(/updateOne|updateMany|findOneAndUpdate/, function pre (next) {
    this.options.runValidators = true; // trigger validation on update
    this.options.context = 'query'; // trigger validation on upsert

    if (this.getUpdate().$setOnInsert.hasOwnProperty('__v')) return next();
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
