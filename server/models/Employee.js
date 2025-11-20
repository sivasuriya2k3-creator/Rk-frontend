import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Developer', 'Designer', '3D Artist', 'UI/UX Designer', 'Project Manager', 'Marketing', 'Sales', 'HR', 'Other']
  },
  department: {
    type: String,
    required: true,
    enum: ['Development', 'Design', '3D Animation', 'UI/UX', 'Management', 'Marketing', 'Sales', 'HR', 'Operations']
  },
  salary: {
    type: Number,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active'
  },
  skills: [{
    type: String
  }],
  avatar: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
