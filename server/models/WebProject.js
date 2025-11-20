import mongoose from 'mongoose';

const webProjectSchema = new mongoose.Schema({
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
  projectUrl: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['e-commerce', 'corporate', 'portfolio', 'saas', 'landing-page', 'other'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('WebProject', webProjectSchema);
