import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Customer = BaseSchema({
  email: {
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+.)+[\w-]{2,4}$/, 'Enter valid email address'],
    required: 'Email address is required',
    trim: true,
    type: String,
    unique: true
  },
  status: {
    default: 'active',
    enum: ['blocked', 'active'],
    lowercase: true,
    required: 'Status is required',
    trim: true,
    type: String
  },
  tenant: {
    lowercase: true,
    required: 'Tenant is required',
    trim: true,
    type: String,
    unique: true
  },
  type: {
    default: 'user',
    enum: ['user', 'admin', 'owner', 'superadmin'],
    lowercase: true,
    required: 'Type is required',
    trim: true,
    type: String
  }
});

export default Customer;
