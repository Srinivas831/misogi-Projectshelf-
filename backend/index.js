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
// app.use(cors());
// app.use(cors({ origin: "*" }));
// Add CORS middleware BEFORE routes
app.use(cors({
  origin: '*', // Or set to specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ProjectShelf API Running!');
});

// Routes
app.use('/auth', authRouter);
app.use('/portfolio', portfolioRouter);
app.use('/metrics', metricsRouter); 

// Get all portfolios
app.get('/all-portfolios', async (req, res) => {
  try {
    const portfolios = await PortfolioModel.find()
      .populate('userId', 'userName')  // Get the userName with the portfolio
      .select('title overview tools slug'); // Only return title, overview, and tools
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a particular portfolio based on userName and slug
app.get('/:userName/:slug', async (req, res) => {
  try {
    const { userName, slug } = req.params;

    // Step 1: Find the user by userName
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Find the portfolio using userId and slug
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

app.listen(8080, async()=>{
    try{
        await connection;
        console.log("connected to db");
        console.log("server is running on port 8080");
    }
    catch(err){
console.log("error connecting db",err);
    }
})

