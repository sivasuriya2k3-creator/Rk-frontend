import Project from '../models/Project.js';
import Employee from '../models/Employee.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin
export const getProjects = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const projects = await Project.find(filter)
      .populate('assignedTo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private/Admin
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedTo');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    // Add project to assigned employees
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      await Employee.updateMany(
        { _id: { $in: req.body.assignedTo } },
        { $push: { projects: project._id } }
      );
    }

    const populatedProject = await Project.findById(project._id)
      .populate('assignedTo');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const oldProject = await Project.findById(req.params.id);
    
    if (!oldProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove project from old assigned employees
    if (oldProject.assignedTo && oldProject.assignedTo.length > 0) {
      await Employee.updateMany(
        { _id: { $in: oldProject.assignedTo } },
        { $pull: { projects: oldProject._id } }
      );
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo');

    // Add project to new assigned employees
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      await Employee.updateMany(
        { _id: { $in: req.body.assignedTo } },
        { $push: { projects: project._id } }
      );
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove project from assigned employees
    if (project.assignedTo && project.assignedTo.length > 0) {
      await Employee.updateMany(
        { _id: { $in: project.assignedTo } },
        { $pull: { projects: project._id } }
      );
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private/Admin
export const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ 
      status: { $in: ['Planning', 'In Progress', 'Review'] } 
    });
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const onHoldProjects = await Project.countDocuments({ status: 'On Hold' });
    
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);

    const statusStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBudget = await Project.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$budget' },
          paid: { $sum: '$paid' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        categoryStats,
        statusStats,
        budget: totalBudget[0] || { total: 0, paid: 0 }
      }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add milestone to project
// @route   POST /api/projects/:id/milestones
// @access  Private/Admin
export const addMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.milestones.push(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Add note to project
// @route   POST /api/projects/:id/notes
// @access  Private/Admin
export const addNote = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.notes.push(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(400).json({ error: error.message });
  }
};
