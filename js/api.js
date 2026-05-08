const API_URL = 'http://localhost:3000/api';

const api = {
  getSeries: async () => {
    const res = await fetch(`${API_URL}/series`);
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
  }
};