import BrandingIdentity from '../models/BrandingIdentity.js';

// @desc    Get all branding identity items
// @route   GET /api/branding
// @access  Public
export const getAllBrandingItems = async (req, res) => {
  try {
    const items = await BrandingIdentity.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching branding items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching branding items',
      error: error.message
    });
  }
};

// @desc    Get single branding identity item
// @route   GET /api/branding/:id
// @access  Public
export const getBrandingItem = async (req, res) => {
  try {
    const item = await BrandingIdentity.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching branding item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching branding item',
      error: error.message
    });
  }
};

// @desc    Create new branding identity item
// @route   POST /api/branding
// @access  Private (Admin only)
export const createBrandingItem = async (req, res) => {
  try {
    const { title, description, mediaType, mediaUrl, fileFormat, tags, featured } = req.body;
    
    const item = await BrandingIdentity.create({
      title,
      description,
      mediaType,
      mediaUrl,
      fileFormat,
      tags: tags || [],
      featured: featured || false,
      createdBy: req.user.id || req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error creating branding item:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating branding item',
      error: error.message
    });
  }
};

// @desc    Update branding identity item
// @route   PUT /api/branding/:id
// @access  Private (Admin only)
export const updateBrandingItem = async (req, res) => {
  try {
    let item = await BrandingIdentity.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }
    
    item = await BrandingIdentity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating branding item:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating branding item',
      error: error.message
    });
  }
};

// @desc    Like a branding identity item
// @route   POST /api/branding/:id/like
// @access  Private
export const likeBrandingItem = async (req, res) => {
  try {
    const item = await BrandingIdentity.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }

    const userId = req.user.id || req.user._id;
    
    // Check if user already liked this item
    if (item.likedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this item'
      });
    }

    // Add user to likedBy array and increment likes
    item.likedBy.push(userId);
    item.likes += 1;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item liked successfully',
      data: {
        likes: item.likes,
        likedBy: item.likedBy
      }
    });
  } catch (error) {
    console.error('Error liking branding item:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking item',
      error: error.message
    });
  }
};

// @desc    Unlike a branding identity item
// @route   DELETE /api/branding/:id/like
// @access  Private
export const unlikeBrandingItem = async (req, res) => {
  try {
    const item = await BrandingIdentity.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }

    const userId = req.user.id || req.user._id;
    
    // Check if user has liked this item
    const likedIndex = item.likedBy.indexOf(userId);
    if (likedIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this item'
      });
    }

    // Remove user from likedBy array and decrement likes
    item.likedBy.splice(likedIndex, 1);
    item.likes = Math.max(0, item.likes - 1);
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item unliked successfully',
      data: {
        likes: item.likes,
        likedBy: item.likedBy
      }
    });
  } catch (error) {
    console.error('Error unliking branding item:', error);
    res.status(500).json({
      success: false,
      message: 'Error unliking item',
      error: error.message
    });
  }
};

// @desc    Add additional media to branding item
// @route   POST /api/branding/:id/media
// @access  Private (Admin only)
export const addAdditionalMedia = async (req, res) => {
  try {
    const { mediaType, mediaUrl, fileFormat } = req.body;
    
    if (!mediaType || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mediaType and mediaUrl'
      });
    }

    const item = await BrandingIdentity.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }

    item.additionalMedia.push({
      mediaType,
      mediaUrl,
      fileFormat: fileFormat || mediaUrl.split('.').pop()
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Additional media added successfully',
      data: item
    });
  } catch (error) {
    console.error('Error adding additional media:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding additional media',
      error: error.message
    });
  }
};

// @desc    Delete branding identity item
// @route   DELETE /api/branding/:id
// @access  Private (Admin only)
export const deleteBrandingItem = async (req, res) => {
  try {
    const item = await BrandingIdentity.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Branding item not found'
      });
    }
    
    await item.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Branding item deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting branding item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting branding item',
      error: error.message
    });
  }
};
