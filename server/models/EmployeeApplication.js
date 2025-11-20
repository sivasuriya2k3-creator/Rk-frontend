import mongoose from 'mongoose';

const employeeApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  position: {
    type: String,
    required: [true, 'Please select a position'],
    enum: ['Developer', 'Designer', '3D Artist', 'UI/UX Designer', 'Project Manager', 'Marketing', 'Sales', 'HR', 'Other']
  },
  department: {
    type: String,
    required: [true, 'Please select a department'],
    enum: ['Development', 'Design', '3D Animation', 'UI/UX', 'Management', 'Marketing', 'Sales', 'HR', 'Operations']
  },
  experience: {
    type: String,
    required: [true, 'Please provide years of experience'],
    enum: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years']
  },
  education: {
    type: String,
    required: [true, 'Please provide your education'],
    trim: true
  },
  skills: {
    type: String,
    required: [true, 'Please list your skills'],
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please write a cover letter'],
    trim: true
  },
  expectedSalary: {
    type: Number,
    required: [true, 'Please provide expected salary']
  },
  workPreference: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'On-site', 'Hybrid'],
    default: 'Full-time'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('EmployeeApplication', employeeApplicationSchema);
