import React, { useState, useEffect } from 'react';
import './App.css';
import QueryPanel from './components/QueryPanel';
import ResultsPanel from './components/ResultsPanel';
import Pagination from './components/Pagination';

function App() {
  const [filters, setFilters] = useState({
    years: [],
    methods: [],
    hosts: [],
    facilities: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ data: [], total: 0 });
  const [queryParams, setQueryParams] = useState({
    year: '',
    method: '',
    host: '',
    facility: '',
    page: 1,
    sortBy: '',
    sortOrder: 'asc',
  });

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilters();
  }, []);

  // Fetch results when query params change
  useEffect(() => {
    if (!loading) {
      fetchResults();
    }
  }, [queryParams.page, queryParams.sortBy, queryParams.sortOrder]);

  const fetchFilters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/filters');
      const data = await response.json();
      console.log("filter api data", data)
      setFilters(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load filter options. Please try again later.');
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { year, method, host, facility, page, sortBy, sortOrder } = queryParams;
      
      let url = `http://localhost:5000/api/exoplanets?page=${page}`;
      if (year) url += `&year=${year}`;
      if (method) url += `&method=${method}`;
      if (host) url += `&host=${host}`;
      if (facility) url += `&facility=${facility}`;
      if (sortBy) url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      const response = await fetch(url);
      const data = await response.json();
      console.log("fetch results data", data)
      
      if (response.ok) {
        setResults(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch results.');
      }
    } catch (err) {
      setError('An error occurred while fetching results.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Validation - ensure at least one filter is selected
    if (!queryParams.year && !queryParams.method && !queryParams.host && !queryParams.facility) {
      setError('Please select at least one filter option before searching.');
      return;
    }

    // Reset page to 1 when performing a new search
    setQueryParams(prev => ({ ...prev, page: 1 }));
    fetchResults();
  };

  const handleClear = () => {
    setQueryParams({
      year: '',
      method: '',
      host: '',
      facility: '',
      page: 1,
      sortBy: '',
      sortOrder: 'asc',
    });
    setResults({ data: [], total: 0 });
    setError(null);
  };

  const handleSort = (column) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="App">
      <header>
        <h1>NASA Exoplanet Query</h1>
      </header>
      <main>
        <QueryPanel
          filters={filters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={loading}
        />
        
        {error && <div className="error-message">{error}</div>}
        
        {results.data.length > 0 && (
          <>
            <ResultsPanel 
              results={results.data} 
              onSort={handleSort} 
              sortColumn={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
            />
            <Pagination
              currentPage={queryParams.page}
              totalPages={results.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
