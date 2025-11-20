import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    company: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', '3D Animation', 'UI/UX Design', 'Branding', 'Marketing', 'Other']
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planning'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  budget: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  notes: [{
    content: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
