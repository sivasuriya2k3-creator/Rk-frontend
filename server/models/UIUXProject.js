import mongoose from 'mongoose';

const uiuxProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  additionalMedia: [{
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    fileFormat: String
  }],
  prototypeUrl: {
    type: String,
    trim: true
  },
  tools: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'tablet', 'cross-platform', 'other'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('UIUXProject', uiuxProjectSchema);
