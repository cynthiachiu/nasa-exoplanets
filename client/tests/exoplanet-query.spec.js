const { test, expect } = require('@playwright/test');

test.describe('NASA Exoplanet Query App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('http://localhost:3000');
    
    // Wait for the application to load completely
    await page.waitForSelector('.query-panel', { state: 'visible' });
    await page.waitForLoadState('networkidle');
  });

  test('should load the application with all filter dropdowns', async ({ page }) => {
    // Check that all filter dropdowns are present
    await expect(page.locator('#year')).toBeVisible();
    await expect(page.locator('#method')).toBeVisible();
    await expect(page.locator('#host')).toBeVisible();
    await expect(page.locator('#facility')).toBeVisible();
    
    // Check that search and clear buttons are present
    await expect(page.locator('button.search-button')).toBeVisible();
    await expect(page.locator('button.clear-button')).toBeVisible();

    // Verify there are no results shown initially
    await expect(page.locator('.results-panel')).not.toBeVisible();
  });

  test('should show error when searching without filters', async ({ page }) => {
    // Click search without selecting any filters
    await page.click('button.search-button');
    
    // Verify error message appears
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Please select at least one filter');
  });

  test('should filter exoplanets by discovery year', async ({ page }) => {
    // Select a specific year from the dropdown
    await page.selectOption('#year', '2010');
    
    // Click search
    await page.click('button.search-button');
    
    // Wait for results to load
    await page.waitForSelector('.results-panel', { state: 'visible' });
    
    // Check that all results have the correct year
    const rows = page.locator('.results-panel tbody tr');
    const count = await rows.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(rows.nth(i).locator('td').first()).toContainText('2010');
    }
  });

  test('should filter exoplanets by discovery method', async ({ page }) => {
    // Select a specific method from the dropdown
    await page.selectOption('#method', 'Transit');
    
    // Click search
    await page.click('button.search-button');
    
    // Wait for results to load
    await page.waitForSelector('.results-panel', { state: 'visible' });
    
    // Check that all results have the correct method
    const rows = page.locator('.results-panel tbody tr');
    const count = await rows.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(rows.nth(i).locator('td').nth(1)).toContainText('Transit');
    }
  });

  test('should filter with multiple criteria', async ({ page }) => {
    // Select both year and method
    await page.selectOption('#year', '2008');
    await page.selectOption('#method', 'Imaging');
    
    // Click search
    await page.click('button.search-button');
    
    // Wait for results to load
    await page.waitForSelector('.results-panel', { state: 'visible' });

    // Check that results have both correct year and method
    const rows = page.locator('.results-panel tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(rows.nth(i).locator('td').first()).toContainText('2008');
      await expect(rows.nth(i).locator('td').nth(1)).toContainText('Imaging');
    }
  });

  test('should clear filters and results', async ({ page }) => {
    // Set some filters
    await page.selectOption('#year', '2009');
    
    // Search
    await page.click('button.search-button');
    
    // Wait for results
    await page.waitForSelector('.results-panel', { state: 'visible' });
    
    // Clear the filters
    await page.click('button.clear-button');
    
    // Verify the filters are reset
    await expect(page.locator('#year')).toHaveValue('');
    await expect(page.locator('#method')).toHaveValue('');
    await expect(page.locator('#host')).toHaveValue('');
    await expect(page.locator('#facility')).toHaveValue('');
    
    // Verify results are gone
    await expect(page.locator('.results-panel')).not.toBeVisible();
  });

  test('should sort results when clicking on column headers', async ({ page }) => {
    // Select a filter that will return multiple results
    await page.selectOption('#method', 'Radial Velocity');
    
    // Search
    await page.click('button.search-button');
    
    // Wait for results
    await page.waitForSelector('.results-panel', { state: 'visible' });
    
    // Get current year values
    const getYears = async () => {
      const years = [];
      const rows = page.locator('.results-panel tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const yearText = await rows.nth(i).locator('td').first().textContent();
        years.push(yearText.trim());
      }
      
      return years;
    };
    
    const initialYears = await getYears();
    
    // Click on Year header to sort ascending
    await page.click('th:has-text("Year")');
    await page.waitForLoadState('networkidle');
    
    const ascendingYears = await getYears();
    
    // Click again to sort descending
    await page.click('th:has-text("Year")');
    await page.waitForLoadState('networkidle');
    
    const descendingYears = await getYears();
    
    // Verify sorting worked
    expect(ascendingYears.join()).not.toEqual(descendingYears.join());
    
    // Extra check: descending should be reverse of ascending
    const reversedAscending = [...ascendingYears].sort((a, b) => b - a);
    expect(descendingYears.slice(0, reversedAscending.length).join()).toEqual(reversedAscending.join());
  });

  test('should navigate through pagination', async ({ page }) => {
    // Select a filter that will return many results
    await page.selectOption('#method', 'Radial Velocity');
    
    // Search
    await page.click('button.search-button');
    
    // Wait for results
    await page.waitForSelector('.results-panel', { state: 'visible' });
    await page.waitForSelector('.pagination', { state: 'visible' });
    
    // Get rows from first page
    const getFirstRowText = async () => {
      return await page.locator('.results-panel tbody tr').first().textContent();
    };
    
    const firstPageFirstRow = await getFirstRowText();
    
    // Go to second page
    await page.click('button.page-button:has-text("2")');
    await page.waitForLoadState('networkidle');
    
    // Get rows from second page
    const secondPageFirstRow = await getFirstRowText();
    
    // Verify different content on different pages
    expect(firstPageFirstRow).not.toEqual(secondPageFirstRow);
    
    // Test next button
    await page.click('button.page-button:has-text("Next")');
    await page.waitForLoadState('networkidle');
    
    const thirdPageFirstRow = await getFirstRowText();
    expect(thirdPageFirstRow).not.toEqual(secondPageFirstRow);
    
    // Test previous button
    await page.click('button.page-button:has-text("Previous")');
    await page.waitForLoadState('networkidle');
    
    const backToSecondPageFirstRow = await getFirstRowText();
    expect(backToSecondPageFirstRow).toEqual(secondPageFirstRow);
  });

  test('should open NASA detail page when clicking on host name', async ({ page, context }) => {
    // Select a filter
    await page.selectOption('#year', '2008');
    
    // Search
    await page.click('button.search-button');
    
    // Wait for results
    await page.waitForSelector('.results-panel', { state: 'visible' });
    
    // Check that links are present and have correct href
    const hostLink = page.locator('.results-panel tbody tr').first().locator('td').nth(2).locator('a');
    await expect(hostLink).toBeVisible();
    
    const hostName = await hostLink.textContent();
    const href = await hostLink.getAttribute('href');
    
    expect(href).toContain('exoplanetarchive.ipac.caltech.edu/overview/');
    expect(href).toContain(hostName.trim());

    // Check that link opens in new tab with correct URL
    // We'll create a listener for new pages instead of actually navigating
    const pagePromise = context.waitForEvent('page');
    await hostLink.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('exoplanetarchive.ipac.caltech.edu/overview/');
  });
});