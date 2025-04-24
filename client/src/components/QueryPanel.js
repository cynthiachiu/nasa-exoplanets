import React from 'react';

function QueryPanel({ filters, queryParams, setQueryParams, onSearch, onClear, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="query-panel">
      <h2>Search Exoplanets</h2>
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="year">Discovery Year:</label>
          <select 
            name="year" 
            id="year" 
            value={queryParams.year} 
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            {filters.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="method">Discovery Method:</label>
          <select 
            name="method" 
            id="method" 
            value={queryParams.method} 
            onChange={handleChange}
          >
            <option value="">Select Method</option>
            {filters.methods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="host">Host Name:</label>
          <select 
            name="host" 
            id="host" 
            value={queryParams.host} 
            onChange={handleChange}
          >
            <option value="">Select Host</option>
            {filters.hosts.map(host => (
              <option key={host} value={host}>{host}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="facility">Discovery Facility:</label>
          <select 
            name="facility" 
            id="facility" 
            value={queryParams.facility} 
            onChange={handleChange}
          >
            <option value="">Select Facility</option>
            {filters.facilities.map(facility => (
              <option key={facility} value={facility}>{facility}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="query-buttons">
        <button 
          onClick={onClear} 
          className="clear-button"
          disabled={loading}
        >
          Clear
        </button>
        <button 
          onClick={onSearch} 
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
}

export default QueryPanel;