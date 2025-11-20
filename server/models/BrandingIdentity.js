import mongoose from 'mongoose';

const brandingIdentitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  mediaType: {
    type: String,
    required: [true, 'Please specify media type'],
    enum: ['image', 'video']
  },
  mediaUrl: {
    type: String,
    required: [true, 'Please provide media URL']
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
  fileFormat: {
    type: String,
    required: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update timestamp on save
brandingIdentitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('BrandingIdentity', brandingIdentitySchema);
