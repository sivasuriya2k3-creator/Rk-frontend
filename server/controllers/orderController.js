import Order from '../models/Order.js';
import CanceledOrder from '../models/CanceledOrder.js';

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { service, clientInfo, title, description, budget, timeline, priority, requirements } = req.body;

    const order = await Order.create({
      user: req.user.id,
      service,
      clientInfo,
      title,
      description,
      budget,
      timeline,
      priority: priority || 'medium',
      requirements
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'review', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    order.status = status;
    
    // Add note if provided
    if (notes && notes.trim()) {
      if (!order.notes) {
        order.notes = [];
      }
      order.notes.push({
        message: notes,
        author: req.user.id,
        createdAt: new Date()
      });
    }
    
    // Update timestamps based on status
    if (status === 'completed') {
      order.completedDate = new Date();
      order.actualCompletion = new Date();
    }
    
    await order.save();
    
    // Populate user info for response
    await order.populate('user', 'name email');
    await order.populate('notes.author', 'name email');

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this order'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    console.log('getAllOrders - Starting...');
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    console.log('getAllOrders - Querying database...');
    const total = await Order.countDocuments();
    console.log('getAllOrders - Total orders:', total);
    
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    console.log('getAllOrders - Orders found:', orders.length);

    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      count: orders.length
    };

    const responseData = {
      success: true,
      pagination,
      data: orders
    };

    console.log('getAllOrders - Sending response:', { 
      success: responseData.success, 
      ordersCount: orders.length,
      pagination 
    });
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('getAllOrders - Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Cancel order and move to canceled collection
// @route   DELETE /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Create canceled order record
    const canceledOrder = await CanceledOrder.create({
      originalOrderId: order._id,
      user: order.user._id,
      userName: order.user.name,
      userEmail: order.user.email,
      service: order.service,
      clientInfo: order.clientInfo,
      title: order.title,
      description: order.description,
      budget: order.budget,
      timeline: order.timeline,
      priority: order.priority,
      originalStatus: order.status,
      requirements: order.requirements,
      canceledBy: req.user.id,
      cancellationReason: req.body.reason || 'No reason provided',
      orderCreatedAt: order.createdAt
    });

    // Delete the original order
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order canceled successfully',
      data: canceledOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order'
    });
  }
};

// @desc    Get all canceled orders for a user
// @route   GET /api/orders/canceled
// @access  Private
export const getCanceledOrders = async (req, res, next) => {
  try {
    const canceledOrders = await CanceledOrder.find({ user: req.user.id })
      .sort({ canceledAt: -1 });

    res.status(200).json({
      success: true,
      count: canceledOrders.length,
      data: canceledOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all canceled orders (Admin only)
// @route   GET /api/orders/admin/canceled
// @access  Private/Admin
export const getAllCanceledOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const canceledOrders = await CanceledOrder.find()
      .sort({ canceledAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('canceledBy', 'name email');

    const total = await CanceledOrder.countDocuments();

    res.status(200).json({
      success: true,
      count: canceledOrders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: canceledOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};