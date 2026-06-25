const express = require('express');
const { getAllDishes, toggleDishPublished } = require('../controllers/dishController');

const router = express.Router();

router.get('/', getAllDishes);
router.patch('/:dishId', toggleDishPublished);

module.exports = router;
