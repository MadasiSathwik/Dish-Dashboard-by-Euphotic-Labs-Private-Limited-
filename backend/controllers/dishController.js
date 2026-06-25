const Dish = require('../models/Dish');

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dishes', error: error.message });
  }
};

const toggleDishPublished = async (req, res) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findOne({ dishId });

    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    dish.isPublished = !dish.isPublished;
    const updatedDish = await dish.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('dishUpdated', updatedDish);
    }

    res.status(200).json({ success: true, data: updatedDish });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update dish', error: error.message });
  }
};

module.exports = {
  getAllDishes,
  toggleDishPublished,
};
