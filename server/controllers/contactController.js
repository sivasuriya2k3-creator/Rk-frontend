import Contact from '../models/Contact.js';

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      inquiryType,
      subject,
      message
    });

    console.log('Contact message created:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      inquiryType: contact.inquiryType,
      subject: contact.subject
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContact = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Please provide a valid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
