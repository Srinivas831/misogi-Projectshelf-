const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  overview: { type: String, required: true }, // Can be rich text
   slug: { type: String, required: true, unique: true },
  media: {
    images: [String],   // Array of image URLs
    videos: [String],   // Array of video URLs
    links: [String]     // Array of reference URLs
  },
  timeline: { type: String }, // Simple text field for now
  tools: [String],            // Array of tools/technologies
  outcomes: {
    metrics: String,
    testimonials: String
  },
  theme: { type: String, enum: ['classic', 'modern', 'minimalist'], default: 'classic' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PortfolioModel = mongoose.model('Portfolio', portfolioSchema);
module.exports = { PortfolioModel };
