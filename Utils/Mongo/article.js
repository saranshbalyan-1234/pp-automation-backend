import BaseSchema from '#utils/Mongo/BaseSchema.js';

const UserSchema = BaseSchema({
  name: {
    required: true,
    type: String
  }
});

// Const model = mongoose.model('saranshes', UserSchema);
export default UserSchema;
