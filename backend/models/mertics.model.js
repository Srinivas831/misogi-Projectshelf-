const mongoose = require('mongoose');

const metricsSchema = mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  clickThroughs: { type: Number, default: 0 },
  engagementTime: { type: Number, default: 0 },  // Time in seconds
  lastUpdated: { type: Date, default: Date.now },
});

const MetricsModel = mongoose.model('Metrics', metricsSchema);

module.exports = { MetricsModel };
