const UI = {
  renderSeries: (series, filtro = 'todas') => {
    const lista = document.getElementById('lista-series');

    const filtradas = filtro === 'todas'
      ? series
      : series.filter(s => s.status === filtro);

    if (filtradas.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎬</div>
          <p>${filtro === 'todas' ? 'No hay series todavía. ¡Agrega una!' : 'No hay series en esta categoría.'}</p>
        </div>
      `;
      return;
    }

    lista.innerHTML = filtradas.map(s => `
      <div class="card">
        <div class="card-poster">
          <img
            src="${s.image_url || ''}"
            alt="${s.title}"
            onerror="this.src='https://placehold.co/200x300/141414/333?text=Sin+imagen'"
          />
          <div class="card-overlay">
            <button class="btn-editar" onclick="App.editar(${s.id})">Editar</button>
            <button class="btn-eliminar" onclick="App.eliminar(${s.id})">Eliminar</button>
          </div>
        </div>
        <div class="card-info">
          <h3 title="${s.title}">${s.title}</h3>
          <div class="card-meta">
            <span class="card-genre">${s.genre || 'Sin género'}</span>
            ${s.rating ? `<span class="card-rating">★ ${s.rating}</span>` : ''}
          </div>
          <span class="badge ${s.status || 'pendiente'}">${formatStatus(s.status)}</span>
        </div>
      </div>
    `).join('');
  },

  actualizarStats: (series) => {
    document.getElementById('stat-total').textContent = series.length;
    document.getElementById('stat-viendo').textContent = series.filter(s => s.status === 'viendo').length;
    document.getElementById('stat-completada').textContent = series.filter(s => s.status === 'completada').length;
    document.getElementById('stat-pendiente').textContent = series.filter(s => s.status === 'pendiente').length;
  },

  abrirModal: (titulo = 'Nueva Serie') => {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal').classList.remove('hidden');
  },

  cerrarModal: () => {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('form-serie').reset();
    document.getElementById('serie-id').value = '';
  },

  llenarForm: (serie) => {
    document.getElementById('serie-id').value = serie.id;
    document.getElementById('titulo').value = serie.title;
    document.getElementById('genero').value = serie.genre || '';
    document.getElementById('estado').value = serie.status || 'pendiente';
    document.getElementById('rating').value = serie.rating || '';
    document.getElementById('imagen').value = serie.image_url || '';
  },

  getFormData: () => ({
    title: document.getElementById('titulo').value,
    genre: document.getElementById('genero').value,
    status: document.getElementById('estado').value,
    rating: document.getElementById('rating').value || null,
    image_url: document.getElementById('imagen').value || null
  }),

renderPaginacion: (pagination) => {
  const contenedor = document.getElementById('pagination');
  if (!contenedor) return;

  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) {
    contenedor.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button onclick="App.irAPagina(${page - 1})" ${page === 1 ? 'disabled' : ''}>← Anterior</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === page ? 'active' : ''}" onclick="App.irAPagina(${i})">${i}</button>`;
  }

  html += `<button onclick="App.irAPagina(${page + 1})" ${page === totalPages ? 'disabled' : ''}>Siguiente →</button>`;
  html += `<span class="pagination-info">${total} series en total</span>`;

  contenedor.innerHTML = html;
}
};

function formatStatus(status) {
  const map = {
    pendiente: '⏳ Pendiente',
    viendo: '▶ Viendo',
    completada: '✓ Completada'
  };
  return map[status] || 'Pendiente';
}