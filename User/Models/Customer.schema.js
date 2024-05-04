import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Customer = BaseSchema({
  blocked: {
    default: false,
    lowercase: true,
    required: 'Status is required',
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
  tenant: {
    lowercase: true,
    required: 'Tenant is required',
    trim: true,
    type: Array
  }
});

export default Customer;
