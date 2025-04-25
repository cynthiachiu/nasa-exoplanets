const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

let exoplanetData = [];
let uniqueYears = new Set();
let uniqueMethods = new Set();
let uniqueHosts = new Set();
let uniqueFacilities = new Set();

async function fetchExoplanetData() {
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
        if (data.disc_year) uniqueYears.add(data.disc_year);
        if (data.discoverymethod) uniqueMethods.add(data.discoverymethod.replace(/"/g, ''));
        if (data.hostname) uniqueHosts.add(data.hostname.replace(/"/g, ''));
        if (data.disc_facility) uniqueFacilities.add(data.disc_facility.replace(/"/g, ''));
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function initializeData() {
  try {
    exoplanetData = await fetchExoplanetData();
    console.log('Exoplanet data loaded successfully.');
  } catch (error) {
    console.error('Failed to initialize exoplanet data:', error);
  }
}

function getFilterOptions() {
  return {
    years: Array.from(uniqueYears).sort((a, b) => a - b),
    methods: Array.from(uniqueMethods).sort(),
    hosts: Array.from(uniqueHosts).sort(),
    facilities: Array.from(uniqueFacilities).sort(),
  };
}

function filterExoplanets(query) {
  const { year, method, host, facility, page = 1, limit = 10, sortBy, sortOrder } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let filtered = [...exoplanetData];

  if (year) filtered = filtered.filter(p => p.disc_year === year);
  if (method) filtered = filtered.filter(p => p.discoverymethod.replace(/"/g, '') === method);
  if (host) filtered = filtered.filter(p => p.hostname.replace(/"/g, '') === host);
  if (facility) filtered = filtered.filter(p => p.disc_facility.replace(/"/g, '') === facility);

  if (filtered.length === exoplanetData.length && (year || method || host || facility)) {
    throw new Error('No matching results found.');
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      if (a[sortBy] > b[sortBy]) comparison = 1;
      if (a[sortBy] < b[sortBy]) comparison = -1;
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  const total = filtered.length;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  return {
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: filtered.slice(startIndex, endIndex),
  };
}

module.exports = {
  initializeData,
  getFilterOptions,
  filterExoplanets,
};
