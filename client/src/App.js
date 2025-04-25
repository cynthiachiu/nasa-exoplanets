import React from 'react';
import './App.css';
import QueryPanel from './components/QueryPanel';
import ResultsPanel from './components/ResultsPanel';
import StarBackground from './components/StarBackground';
import { useExoplanetQuery } from './hooks/useExoplanetQuery';
import Pagination from '@mui/material/Pagination';

function App() {
  const {
    filters, queryParams, setQueryParams, results, error, loading,
    handleSearch, handleClear, handleSort, handlePageChange,
  } = useExoplanetQuery();

  return (
    <div className="App">
      <StarBackground />
      <header>
        <h1>NASA Exoplanet Query</h1>
        <p className="subtitle">Explore the cosmos: {results.total > 0 ? results.total : '4,000+'} exoplanets discovered since 1992</p>
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
              className='pagination'
              count={results.totalPages}
              page={queryParams.page}
              onChange={(event, newPage) => handlePageChange(newPage)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
