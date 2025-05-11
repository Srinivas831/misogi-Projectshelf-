const express = require('express');
const { createPortfolio, updatePortfolio, getUserPortfolios, deletePortfolio, getPortfolioById } = require('../controllers/portfolio.controllers');
const { authMiddleware } = require('../middlewares/auth.middleware');
const portfolioRouter = express.Router();

portfolioRouter.post('/create', authMiddleware, createPortfolio);
portfolioRouter.patch('/edit/:id', authMiddleware, updatePortfolio);
portfolioRouter.delete('/delete/:id', authMiddleware, deletePortfolio);
portfolioRouter.get('/my-portfolios', authMiddleware, getUserPortfolios);
portfolioRouter.get('/:id',authMiddleware, getPortfolioById);



module.exports = {portfolioRouter};
