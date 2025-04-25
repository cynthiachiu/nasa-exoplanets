import { useState, useEffect } from 'react';
import { fetchFilters, fetchExoplanets } from '../services/api';

export const useExoplanetQuery = () => {
  const [filters, setFilters] = useState({ years: [], methods: [], hosts: [], facilities: [] });
  const [queryParams, setQueryParams] = useState({
    year: '', method: '', host: '', facility: '',
    page: 1, sortBy: '', sortOrder: 'asc',
  });
  const [results, setResults] = useState({ data: [], total: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFilters();
        setFilters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (hasSearched) {
      search();
    }
  }, [queryParams.page, queryParams.sortBy, queryParams.sortOrder]);

  const search = async () => {
    setLoading(true);
    try {
      const data = await fetchExoplanets(queryParams);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!queryParams.year && !queryParams.method && !queryParams.host && !queryParams.facility) {
      setError('Please select at least one filter option before searching.');
      return;
    }
    setQueryParams(prev => ({ ...prev, page: 1 }));
    setHasSearched(true);
    search();
  };

  const handleClear = () => {
    setQueryParams({
      year: '', method: '', host: '', facility: '',
      page: 1, sortBy: '', sortOrder: 'asc',
    });
    setResults({ data: [], total: 0 });
    setError(null);
    setHasSearched(false);
  };

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handleSort = (column) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    filters,
    queryParams,
    setQueryParams,
    results,
    error,
    loading,
    handleSearch,
    handleClear,
    handleSort,
    handlePageChange,
  };
};
