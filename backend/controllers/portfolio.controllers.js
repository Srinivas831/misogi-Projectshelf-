const { PortfolioModel } = require("../models/portfolio.model");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with hyphens
    .replace(/^-+|-+$/g, '');    // remove leading/trailing hyphens
};

const createPortfolio = async (req, res) => {
  try {
    console.log("req in createPortfolio", req);
    const userId = req.userId;


    const slug = slugify(req.body.title);
    // check for duplicate slug
    const existing = await PortfolioModel.findOne({ slug });
    if (existing) return res.status(400).json({ message: "Title already exists. Choose a different title." });


    const newPortfolio = new PortfolioModel({ ...req.body, userId, slug });
    await newPortfolio.save();
    res.status(200).send({ message: "Portfolio created", portfolio: newPortfolio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const userId = req.userId;
console.log("req in updatePortfolio", portfolioId);
console.log("req in userId", userId);
    const updated = await PortfolioModel.findOneAndUpdate(
      { _id: portfolioId, userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Portfolio not found" });
    res.status(200).json({ message: "Portfolio updated", portfolio: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const userId = req.userId;

    const deleted = await PortfolioModel.findOneAndDelete({ _id: portfolioId, userId });

    if (!deleted) {
      return res.status(400).json({ message: "Portfolio not found" });
    }

    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting portfolio", error: error.message });
  }
};


const getUserPortfolios = async (req, res) => {
  try {
    const portfolios = await PortfolioModel.find({ userId: req.userId });
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findById(req.params.id);
    console.log("portfolio in getPortfolioById", portfolio);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createPortfolio, updatePortfolio, deletePortfolio, getUserPortfolios, getPortfolioById };
