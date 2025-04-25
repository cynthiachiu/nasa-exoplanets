const { getFilterOptions, filterExoplanets } = require('../services/exoplanetService');

const getFilters = (req, res) => {
  const filters = getFilterOptions();
  res.json(filters);
};

const getExoplanets = (req, res) => {
  try {
    const response = filterExoplanets(req.query);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getFilters,
  getExoplanets,
};
