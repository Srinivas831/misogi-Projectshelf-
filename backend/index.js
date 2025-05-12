const express = require('express');
const { connection } = require('./db');
const cors = require('cors');
const { authRouter } = require('./routes/auth.routes');
const { portfolioRouter } = require('./routes/portfolio.routes');
const { PortfolioModel } = require('./models/portfolio.model');
const { metricsRouter } = require('./routes/metrics.routes');
const { UserModel } = require('./models/user.model');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('ProjectShelf API Running!');
});

app.use('/auth', authRouter);
app.use('/portfolio', portfolioRouter);
app.use('/metrics', metricsRouter);

app.get('/all-portfolios', async (req, res) => {
  try {
    const portfolios = await PortfolioModel.find()
      .populate('userId', 'userName')
      .select('title overview tools slug');
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/:userName/:slug', async (req, res) => {
  try {
    const { userName, slug } = req.params;
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const portfolio = await PortfolioModel.findOne({
      userId: user._id,
      slug: slug.toLowerCase()
    })
      .populate('userId', 'userName')
      .select('title slug overview media timeline tools outcomes theme createdAt updatedAt');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the handler
module.exports = async (req, res) => {
  try {
    if (connection.readyState === 0) {
      await connection;
      console.log("Connected to MongoDB");
    }
    return app(req, res); // Forward the request to Express
  } catch (err) {
    console.error('Connection error:', err);
    res.status(500).send('Database connection failed.');
  }
};
