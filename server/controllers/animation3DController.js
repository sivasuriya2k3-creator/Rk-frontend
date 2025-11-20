import Animation3D from '../models/Animation3D.js';

export const getAllAnimations = async (req, res) => {
  try {
    const animations = await Animation3D.find().sort({ createdAt: -1 });
    res.json(animations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnimationById = async (req, res) => {
  try {
    const animation = await Animation3D.findById(req.params.id);
    if (!animation) {
      return res.status(404).json({ message: 'Animation not found' });
    }
    res.json(animation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createAnimation = async (req, res) => {
  try {
    const animation = new Animation3D(req.body);
    await animation.save();
    res.status(201).json(animation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating animation', error: error.message });
  }
};

export const updateAnimation = async (req, res) => {
  try {
    const animation = await Animation3D.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!animation) {
      return res.status(404).json({ message: 'Animation not found' });
    }
    res.json(animation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating animation', error: error.message });
  }
};

export const deleteAnimation = async (req, res) => {
  try {
    const animation = await Animation3D.findByIdAndDelete(req.params.id);
    if (!animation) {
      return res.status(404).json({ message: 'Animation not found' });
    }
    res.json({ message: 'Animation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
