import mongoose from 'mongoose';

import BaseSchema from './BaseSchema.js';

const UserSchema = BaseSchema({
  dummy: Array,
  name: {
    required: true,
    type: String
  }
});

/*
 *  Schema.pre('update', function( next ) {
 *   this.update({}, { $inc: { __v: 1 } }, next );
 *  });
 */

const model = mongoose.model('saranshes', UserSchema);
export default model;
