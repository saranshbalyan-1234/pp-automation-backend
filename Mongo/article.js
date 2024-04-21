import mongoose from 'mongoose';

import BaseSchema from './BaseSchema.js';

const UserSchema = BaseSchema({
  name: {
    required: true,
    type: String
  }
});

const model = mongoose.model('saranshes', UserSchema);
export default model;
