import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  ordersCount: {
    type: Number,
    default: 0
  },
  projectsCompleted: {
    type: Number,
    default: 0
  },
  newClients: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['order', 'project', 'refund', 'payment'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  expenses: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate net profit before saving
revenueSchema.pre('save', function(next) {
  this.netProfit = this.totalRevenue - this.expenses;
  next();
});

export default mongoose.model('Revenue', revenueSchema);
