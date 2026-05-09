const API_URL = 'http://localhost:3000/api';

const api = {
  getSeries: async (params = {}) => {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.sort) query.append('sort', params.sort);
  if (params.order) query.append('order', params.order);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const url = `${API_URL}/series${query.toString() ? '?' + query.toString() : ''}`;
  const res = await fetch(url);
  return res.json();
},

  getSerieById: async (id) => {
    const res = await fetch(`${API_URL}/series/${id}`);
    return res.json();
  },

  createSerie: async (data) => {
    const res = await fetch(`${API_URL}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateSerie: async (id, data) => {
    const res = await fetch(`${API_URL}/series/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteSerie: async (id) => {
    await fetch(`${API_URL}/series/${id}`, {
      method: 'DELETE'
    });
  },

  getRatings: async (serieId) => {
  const res = await fetch(`${API_URL}/series/${serieId}/rating`);
  return res.json();
},

addRating: async (serieId, data) => {
  const res = await fetch(`${API_URL}/series/${serieId}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
},

deleteRating: async (serieId, ratingId) => {
  await fetch(`${API_URL}/series/${serieId}/rating/${ratingId}`, {
    method: 'DELETE'
  });
}
};