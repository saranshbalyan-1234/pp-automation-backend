import BaseSchema from '#utils/Mongo/BaseSchema.js';

const tenant = BaseSchema({
  name: {
    lowercase: true,
    required: 'Tenant is required',
    trim: true,
    type: String
  },
  type: {
    default: 'user',
    enum: ['user', 'admin', 'owner', 'superadmin'],
    lowercase: true,
    required: 'Type is required',
    trim: true,
    type: String
  }
}, { _id: false });

const User = BaseSchema({
  defaultProjectId: {
    type: String
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
  name: {
    lowercase: true,
    required: 'Name is required',
    trim: true,
    type: String
  },
  password: {
    required: 'Password is required',
    trim: true,
    type: String
  },
  profileImage: {
    type: String
  },
  status: {
    default: 'active',
    enum: ['active', 'inactive', 'blocked'],
    lowercase: true,
    required: 'Status is required',
    trim: true,
    type: String
  },
  tenant: [tenant],
  verifiedAt: {
    required: 'Verified date is required',
    type: Date
  }
});

export default User;
