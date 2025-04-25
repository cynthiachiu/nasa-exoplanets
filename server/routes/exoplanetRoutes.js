const express = require('express');
const router = express.Router();
const {
  getFilters,
  getExoplanets,
} = require('../controllers/exoplanetControllers');

router.get('/filters', getFilters);
router.get('/exoplanets', getExoplanets);

module.exports = router;
