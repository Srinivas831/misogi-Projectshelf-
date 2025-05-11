const express = require('express');
const { MetricsModel } = require('../models/mertics.model');

const metricsRouter = express.Router();

// Increment views
metricsRouter.post('/:portfolioId/increment-views', async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const metrics = await MetricsModel.findOneAndUpdate(
      { portfolioId },
      { $inc: { views: 1 } },
      { new: true, upsert: true } // If no metrics found, create a new one
    );
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment like/dislike
metricsRouter.post('/:portfolioId/increment-likes', async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const metrics = await MetricsModel.findOneAndUpdate(
      { portfolioId },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment click-throughs (links clicked in portfolio)
metricsRouter.post('/:portfolioId/increment-clicks', async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const metrics = await MetricsModel.findOneAndUpdate(
      { portfolioId },
      { $inc: { clickThroughs: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment engagement time (time spent on portfolio in seconds)
metricsRouter.post('/:portfolioId/increment-engagement-time', async (req, res) => {
  const { portfolioId } = req.params;
  const { timeSpent } = req.body;  // Send time in seconds from frontend
  
  try {
    const metrics = await MetricsModel.findOneAndUpdate(
      { portfolioId },
      { $inc: { engagementTime: timeSpent } },
      { new: true, upsert: true }
    );
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get metrics for a particular portfolio (dashboard view)
metricsRouter.get('/:portfolioId', async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const metrics = await MetricsModel.findOne({ portfolioId });
    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found for this portfolio' });
    }
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { metricsRouter };
