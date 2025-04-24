const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Store exoplanet data
let exoplanetData = [];
let uniqueYears = new Set();
let uniqueMethods = new Set();
let uniqueHosts = new Set();
let uniqueFacilities = new Set();

// Function to fetch and parse CSV data
async function fetchExoplanetData() {
  try {
    console.log('Fetching exoplanet data from NASA API...');
    const response = await axios.get(
      'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+disc_year,discoverymethod,hostname,disc_facility+from+ps&format=csv',
      { responseType: 'text' }
    );

    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(response.data);
      
      stream
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
          // Collect unique values for dropdowns
          if (data.disc_year) uniqueYears.add(data.disc_year);
          if (data.discoverymethod) uniqueMethods.add(data.discoverymethod.replace(/"/g, ''));
          if (data.hostname) uniqueHosts.add(data.hostname.replace(/"/g, ''));
          if (data.disc_facility) uniqueFacilities.add(data.disc_facility.replace(/"/g, ''));
        })
        .on('end', () => {
          console.log(`Loaded ${results.length} exoplanet records.`);
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    throw error;
  }
}

// Initialize data on server start
async function initializeData() {
  try {
    exoplanetData = await fetchExoplanetData();
    console.log('Exoplanet data loaded successfully.');
  } catch (error) {
    console.error('Failed to initialize exoplanet data:', error);
  }
}

// API endpoint to get filter options
app.get('/api/filters', (req, res) => {
  res.json({
    years: Array.from(uniqueYears).sort((a, b) => a - b),
    methods: Array.from(uniqueMethods).sort(),
    hosts: Array.from(uniqueHosts).sort(),
    facilities: Array.from(uniqueFacilities).sort(),
  });
});

// API endpoint to search exoplanets
app.get('/api/exoplanets', (req, res) => {
  const { year, method, host, facility, page = 1, limit = 10, sortBy, sortOrder } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // Filter the data based on query parameters
  let filteredData = [...exoplanetData];
  
  if (year) {
    filteredData = filteredData.filter(planet => planet.disc_year === year);
  }
  
  if (method) {
    filteredData = filteredData.filter(planet => planet.discoverymethod.replace(/"/g, '') === method);
  }
  
  if (host) {
    filteredData = filteredData.filter(planet => planet.hostname.replace(/"/g, '') === host);
  }
  
  if (facility) {
    filteredData = filteredData.filter(planet => planet.disc_facility.replace(/"/g, '') === facility);
  }

  // If no filters were applied and it wasn't intentional
  if (filteredData.length === exoplanetData.length && (year || method || host || facility)) {
    return res.status(400).json({ error: 'No matching results found.' });
  }

  // Sort data if sortBy is provided
  if (sortBy) {
    filteredData.sort((a, b) => {
      let comparison = 0;
      if (a[sortBy] > b[sortBy]) {
        comparison = 1;
      } else if (a[sortBy] < b[sortBy]) {
        comparison = -1;
      }
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }

  // Pagination
  const totalResults = filteredData.length;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    total: totalResults,
    page: pageNum,
    totalPages: Math.ceil(totalResults / limitNum),
    data: paginatedData,
  });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeData();
});