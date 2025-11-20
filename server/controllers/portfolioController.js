import Portfolio from '../models/Portfolio.js';

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
export const getAllPortfolio = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const portfolios = await Portfolio.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
export const createPortfolio = async (req, res, next) => {
  try {
    const { title, description, category, image, link, technologies, featured } = req.body;

    if (!title || !description || !category || !image) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      category,
      image,
      link,
      technologies: technologies || [],
      featured: featured || false,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
export const updatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Check if user is owner or admin
    if (portfolio.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Check if user is owner or admin
    if (portfolio.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
