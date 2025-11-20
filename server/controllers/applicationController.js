import EmployeeApplication from '../models/EmployeeApplication.js';
import User from '../models/User.js';

// @desc    Submit employee application
// @route   POST /api/applications/apply
// @access  Public
export const submitApplication = async (req, res, next) => {
  try {
    const { name, email, phone, position, department, experience, education, skills, portfolio, resume, coverLetter, expectedSalary, workPreference } = req.body;

    // Validation
    if (!name || !email || !phone || !position || !department || !experience || !education || !skills || !coverLetter || !expectedSalary) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if application already exists
    const existingApp = await EmployeeApplication.findOne({ email });
    if (existingApp && existingApp.status === 'pending') {
      return res.status(400).json({ error: 'You have already submitted an application. Please wait for review.' });
    }

    // Create application
    const application = await EmployeeApplication.create({
      name,
      email,
      phone,
      position,
      department,
      experience,
      education,
      skills,
      portfolio,
      resume,
      coverLetter,
      expectedSalary,
      workPreference
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await EmployeeApplication.find().populate('reviewedBy', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Admin
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await EmployeeApplication.findById(req.params.id).populate('reviewedBy', 'name email');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Accept application
// @route   PUT /api/applications/:id/accept
// @access  Admin
export const acceptApplication = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const userId = req.user?.id; // From auth middleware

    const application = await EmployeeApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        adminNotes,
        reviewedBy: userId,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application accepted successfully',
      application
    });
  } catch (error) {
    console.error('Accept application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reject application
// @route   PUT /api/applications/:id/reject
// @access  Admin
export const rejectApplication = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const userId = req.user?.id; // From auth middleware

    const application = await EmployeeApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminNotes,
        reviewedBy: userId,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Admin
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await EmployeeApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
};
