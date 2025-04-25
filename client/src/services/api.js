const BASE_URL = 'http://localhost:5000/api';

export const fetchFilters = async () => {
  const res = await fetch(`${BASE_URL}/filters`);
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
};

export const fetchExoplanets = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/exoplanets?${query}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch exoplanets');
  return data;
};
