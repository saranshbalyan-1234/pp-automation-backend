import BaseSchema from '#utils/Mongo/BaseSchema.js';

const UserSchema = BaseSchema({
  email: {
    required: true,
    type: String
  },
  status: {
    required: true,
    type: String
  },
  tenant: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: String
  }
});

// Const model = mongoose.model('saranshes', UserSchema);
export default UserSchema;
