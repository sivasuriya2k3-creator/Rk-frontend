import Revenue from '../models/Revenue.js';
import Order from '../models/Order.js';
import Project from '../models/Project.js';

// Get revenue for a date range
export const getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const revenue = await Revenue.find(query).sort({ date: -1 });
    
    res.json(revenue);
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get revenue for a specific date
export const getRevenueByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    let revenue = await Revenue.findOne({ date: targetDate });
    
    if (!revenue) {
      revenue = await calculateRevenueForDate(targetDate);
    }
    
    res.json(revenue);
  } catch (error) {
    console.error('Error fetching revenue by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Calculate and update revenue for today
export const updateTodayRevenue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const revenue = await calculateRevenueForDate(today);
    
    res.json({ message: 'Revenue updated successfully', revenue });
  } catch (error) {
    console.error('Error updating revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get revenue statistics
export const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    // Calculate today's revenue from completed orders
    const todayEndOfDay = new Date(today);
    todayEndOfDay.setHours(23, 59, 59, 999);
    
    const todayCompletedOrders = await Order.find({
      status: 'completed',
      completedDate: { $gte: today, $lte: todayEndOfDay }
    });
    
    const todayRevenue = todayCompletedOrders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);
    const todayOrdersCount = todayCompletedOrders.length;
    const todayExpenses = todayRevenue * 0.30;
    const todayProfit = todayRevenue - todayExpenses;
    
    // Calculate this week's revenue from completed orders
    const weekCompletedOrders = await Order.find({
      status: 'completed',
      completedDate: { $gte: lastWeek }
    });
    
    const weekRevenue = weekCompletedOrders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);
    const weekOrdersCount = weekCompletedOrders.length;
    
    // Calculate this month's revenue from completed orders
    const monthCompletedOrders = await Order.find({
      status: 'completed',
      completedDate: { $gte: lastMonth }
    });
    
    const monthRevenue = monthCompletedOrders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);
    const monthOrdersCount = monthCompletedOrders.length;
    
    // Generate chart data for last 30 days
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Get completed orders for this specific day
      const dayOrders = await Order.find({
        status: 'completed',
        completedDate: { $gte: date, $lt: nextDay }
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);
      const dayOrdersCount = dayOrders.length;
      const dayExpenses = dayRevenue * 0.30;
      const dayProfit = dayRevenue - dayExpenses;
      
      chartData.push({
        date: date.toISOString(),
        revenue: dayRevenue,
        orders: dayOrdersCount,
        profit: dayProfit
      });
    }
    
    res.json({
      today: {
        revenue: todayRevenue,
        orders: todayOrdersCount,
        profit: todayProfit
      },
      week: {
        revenue: weekRevenue,
        orders: weekOrdersCount
      },
      month: {
        revenue: monthRevenue,
        orders: monthOrdersCount
      },
      chart: chartData
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate revenue for a specific date
async function calculateRevenueForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Get completed orders for this date (revenue is recognized when orders are completed)
  const completedOrders = await Order.find({
    status: 'completed',
    completedDate: { $gte: startOfDay, $lte: endOfDay }
  });
  
  // Calculate total revenue from completed orders
  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);
  const ordersCount = completedOrders.length;
  
  // Get all orders created on this date for new clients calculation
  const ordersCreatedToday = await Order.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });
  
  // Get completed projects for this date
  const projectsCompleted = await Project.countDocuments({
    completedDate: { $gte: startOfDay, $lte: endOfDay },
    status: 'Completed'
  });
  
  // Get new clients (first-time orders created today)
  const newClientsCount = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
    { $group: { _id: '$user' } },
    { $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'user',
      as: 'userOrders'
    }},
    { $match: { 'userOrders.1': { $exists: false } } },
    { $count: 'newClients' }
  ]);
  
  // Build transactions array from completed orders
  const transactions = completedOrders.map(order => ({
    type: 'order',
    amount: order.budget || order.totalAmount || 0,
    orderId: order._id,
    description: `${order.service} - ${order.title}`,
    timestamp: order.completedDate || order.updatedAt
  }));
  
  // Calculate expenses (assuming 30% of revenue as expenses - you can adjust this)
  const expenses = totalRevenue * 0.30;
  const netProfit = totalRevenue - expenses;
  
  // Update or create revenue record
  let revenue = await Revenue.findOne({ date: startOfDay });
  
  if (revenue) {
    revenue.totalRevenue = totalRevenue;
    revenue.ordersCount = ordersCount;
    revenue.projectsCompleted = projectsCompleted;
    revenue.newClients = newClientsCount[0]?.newClients || 0;
    revenue.transactions = transactions;
    revenue.expenses = expenses;
    revenue.netProfit = netProfit;
    await revenue.save();
  } else {
    revenue = await Revenue.create({
      date: startOfDay,
      totalRevenue,
      ordersCount,
      projectsCompleted,
      newClients: newClientsCount[0]?.newClients || 0,
      transactions,
      expenses,
      netProfit
    });
  }
  
  return revenue;
}

export { calculateRevenueForDate };
