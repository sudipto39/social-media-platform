const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  socialAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialAccount',
    required: true
  }],
  content: {
    type: String,
    required: true
  },
  media: [String], // URLs or file references
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  scheduledFor: Date,
  publishedAt: Date,
  platform: [{
    type: String,
    enum: ['twitter', 'linkedin', 'instagram']
  }],
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
