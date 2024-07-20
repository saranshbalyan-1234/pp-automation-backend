import BaseSchema from '#utils/Mongo/BaseSchema.js';

const customerSchema = BaseSchema({
  blocked: {
    default: false,
    lowercase: true,
    required: 'Blocked Status is required',
    trim: true,
    type: Boolean
  },
  email: {
    immutable: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+.)+[\w-]{2,4}$/, 'Enter valid email address'],
    required: 'Email address is required',
    trim: true,
    type: String,
    unique: true
  },
  password: {
    required: 'Password is required',
    trim: true,
    type: String
  },
  superAdmin: {
    default: false,
    immutable: true,
    lowercase: true,
    required: 'SuperAdmin is required',
    trim: true,
    type: Boolean
  },
  tenant: {
    required: 'tenant is required',
    type: Array
  }
});

export default customerSchema;
