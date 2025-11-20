import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'Web Design & Development',
      'Branding & Identity',
      '3D Animation',
      'Video Production',
      'UI/UX Design',
      'Digital Strategy'
    ]
  },
  // Client Details
  clientInfo: {
    companyName: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp', 'teams'],
      default: 'email'
    }
  },
  // Project Details
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [8300, 'Budget must be at least ₹8,300']
  },
  totalAmount: {
    type: Number,
    default: function() {
      return this.budget;
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', '3-6 months', '6+ months']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  requirements: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedCompletion: {
    type: Date
  },
  actualCompletion: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  notes: [{
    message: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ service: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);