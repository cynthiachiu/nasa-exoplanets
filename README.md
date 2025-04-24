# NASA Exoplanet Query Application

This application allows users to search through NASA's exoplanet data using various filters including discovery year, method, host name, and discovery facility.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Design Decisions & Assumptions](#design-decisions--assumptions)
- [Future Improvements](#future-improvements)

## Features

- 🔍 Filter exoplanets by year of discovery, discovery method, host name, and discovery facility
- 📊 Display results in a sortable table format
- 📑 Pagination support for large result sets
- 🔗 Host names link to NASA's Confirmed Planet Overview Page
- 🔄 Sort functionality for all columns
- ✅ Comprehensive automated testing with Playwright

## Tech Stack

### Backend
- Node.js
- Express
- Axios for API requests
- CSV parser

### Frontend
- React
- CSS (with responsive design)

### Testing
- Playwright for end-to-end testing

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Backend Setup
1. Clone the repository:
   ```
   git clone <repository-url>
   cd nasa-exoplanet-query
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

### Frontend Setup
1. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

2. Install Playwright for testing:
   ```
   npm install --save-dev @playwright/test
   npx playwright install
   ```

## Running the Application

### Starting the Backend Server
```
cd server
node server.js
```
The server will start on http://localhost:5000

### Starting the Frontend Application
```
cd client
npm start
```
The application will be available at http://localhost:3000

## Testing

### Running End-to-End Tests
Make sure the backend server is running, then:

```
cd client
npm run test:e2e
```

This will run the Playwright tests and generate an HTML report with the results.

### Viewing Test Reports
After running tests, you can view the HTML report:

```
npx playwright show-report
```

## Design Decisions & Assumptions

### Data Loading & Storage
- I chose to load all exoplanet data on server startup rather than querying NASA's API for each user request. This design decision improves response time for user queries at the cost of a slightly longer initial server startup.
- The data is stored in memory for fast access, assuming the dataset size (approx. 4,000 records) is manageable for a typical server.

### Filter Implementation
- Dropdowns are populated with unique values from the dataset to ensure users only select valid options.
- The filtering logic combines multiple criteria with an AND relationship, assuming users want to narrow down results rather than expand them.

### Pagination
- A limit of 10 items per page was implemented to prevent overwhelming users with too much data at once.
- The pagination control adapts to show a reasonable number of page links with ellipses for large result sets.

### Sorting
- Column sorting is handled server-side to minimize data transfer and leverage server processing power.
- Both ascending and descending sorting is supported on all columns.

### API Structure
- RESTful principles were followed for clarity and maintainability.
- Separate endpoints were created for filter options and exoplanet data to allow the frontend to load the UI before data is available.

### Testing Approach
- End-to-end tests with Playwright were chosen to verify the entire application flow rather than just unit testing isolated components.
- Tests are designed to be resilient to small UI changes by focusing on functionality rather than exact layout.

<!-- ## Future Improvements

1. **Caching Layer**: Implement Redis or similar caching for frequently accessed queries
2. **Advanced Filtering**: Add range filters for numerical values and fuzzy search for text fields
3. **Data Visualization**: Add charts and graphs for discovery trends
4. **Offline Support**: Implement service workers for offline functionality
5. **Server-Side Rendering**: Convert to Next.js for improved SEO and initial load performance
6. **Data Export**: Allow users to export filtered results in various formats
7. **Saved Searches**: Enable users to save and name common searches
8. **Dark Mode**: Add theme support for better user experience
9. **Performance Optimization**: Implement virtualized lists for handling larger result sets
10. **More Comprehensive Tests**: Add unit tests and API-level tests in addition to E2E tests -->