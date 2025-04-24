import React from 'react';

function ResultsPanel({ results, onSort, sortColumn, sortOrder }) {
  // Function to render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="results-panel">
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort('disc_year')}>
              Year {renderSortIcon('disc_year')}
            </th>
            <th onClick={() => onSort('discoverymethod')}>
              Method {renderSortIcon('discoverymethod')}
            </th>
            <th onClick={() => onSort('hostname')}>
              Host Name {renderSortIcon('hostname')}
            </th>
            <th onClick={() => onSort('disc_facility')}>
              Facility {renderSortIcon('disc_facility')}
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((planet, index) => (
            <tr key={index}>
              <td>{planet.disc_year}</td>
              <td>{planet.discoverymethod.replace(/"/g, '')}</td>
              <td>
                <a 
                  href={`https://exoplanetarchive.ipac.caltech.edu/overview/${planet.hostname.replace(/"/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {planet.hostname.replace(/"/g, '')}
                </a>
              </td>
              <td>{planet.disc_facility.replace(/"/g, '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsPanel;