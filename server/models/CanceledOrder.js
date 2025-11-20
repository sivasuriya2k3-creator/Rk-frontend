import mongoose from 'mongoose';

const canceledOrderSchema = new mongoose.Schema({
  // Original order data
  originalOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: [true, 'Service type is required']
  },
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
    required: [true, 'Budget is required']
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  originalStatus: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    trim: true
  },
  // Cancellation details
  canceledAt: {
    type: Date,
    default: Date.now
  },
  canceledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  orderCreatedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
canceledOrderSchema.index({ user: 1, canceledAt: -1 });
canceledOrderSchema.index({ userName: 1 });

export default mongoose.model('CanceledOrder', canceledOrderSchema);
