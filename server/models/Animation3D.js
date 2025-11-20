import mongoose from 'mongoose';

const animation3DSchema = new mongoose.Schema({
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
  videoUrl: {
    type: String,
    trim: true
  },
  software: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  style: {
    type: String,
    enum: ['abstract', 'realistic', 'motion-graphics', 'character', 'product', 'other'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Animation3D', animation3DSchema);
