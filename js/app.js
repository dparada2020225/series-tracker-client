const App = {
  series: [],
  filtroActual: 'todas',
  paginaActual: 1,
  limitePorPagina: 12,
  totalPaginas: 1,

  init: async () => {
    await App.cargarSeries();

    document.getElementById('btn-nueva').addEventListener('click', () => {
      UI.cerrarModal();
      UI.abrirModal('Nueva Serie');
    });

    document.getElementById('btn-cancelar').addEventListener('click', () => {
      UI.cerrarModal();
    });

    document.getElementById('btn-cancelar-2').addEventListener('click', () => {
      UI.cerrarModal();
    });

    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) UI.cerrarModal();
    });

    document.getElementById('lista-series').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const title = btn.dataset.title;

      if (action === 'editar') App.editar(id);
      if (action === 'eliminar') App.eliminar(id);
      if (action === 'rating') App.abrirRatings(id, title);
    });

    document.getElementById('form-serie').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('serie-id').value;
      const data = UI.getFormData();
      const btn = document.getElementById('btn-guardar');

      btn.textContent = 'Guardando...';
      btn.disabled = true;

      if (id) {
        await api.updateSerie(id, data);
      } else {
        await api.createSerie(data);
      }

      UI.cerrarModal();
      await App.cargarSeries();

      btn.textContent = 'Guardar';
      btn.disabled = false;
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        App.filtroActual = btn.dataset.filter;
        App.paginaActual = 1;
        UI.renderSeries(App.series, App.filtroActual);
      });
    });

    document.getElementById('btn-csv').addEventListener('click', () => {
      App.exportarCSV();
    });

    let searchTimeout;
    document.getElementById('search').addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        App.paginaActual = 1;
        App.cargarSeries();
      }, 400);
    });

    document.getElementById('sort').addEventListener('change', () => {
      App.paginaActual = 1;
      App.cargarSeries();
    });

    document.getElementById('order').addEventListener('change', () => {
      App.paginaActual = 1;
      App.cargarSeries();
    });
  },

  cargarSeries: async () => {
    const lista = document.getElementById('lista-series');
    lista.innerHTML = '<p class="loading">Cargando series...</p>';

    const q = document.getElementById('search')?.value || '';
    const sort = document.getElementById('sort')?.value || 'created_at';
    const order = document.getElementById('order')?.value || 'desc';

    const result = await api.getSeries({
      q, sort, order,
      page: App.paginaActual,
      limit: App.limitePorPagina
    });

    App.series = result.data;
    App.totalPaginas = result.pagination.totalPages;

    UI.renderSeries(App.series, App.filtroActual);
    UI.actualizarStats(App.series);
    UI.renderPaginacion(result.pagination);
  },

  irAPagina: (pagina) => {
    App.paginaActual = pagina;
    App.cargarSeries();
  },

  editar: async (id) => {
    const serie = await api.getSerieById(id);
    UI.llenarForm(serie);
    UI.abrirModal('Editar Serie');
  },

  eliminar: async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta serie?')) return;
    await api.deleteSerie(id);
    await App.cargarSeries();
  },

  exportarCSV: () => {
    if (App.series.length === 0) {
      alert('No hay series para exportar.');
      return;
    }

    const headers = ['ID', 'Título', 'Género', 'Estado', 'Rating', 'Imagen', 'Creado'];
    const rows = App.series.map(s => [
      s.id,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${(s.genre || '').replace(/"/g, '""')}"`,
      s.status || '',
      s.rating || '',
      `"${(s.image_url || '').replace(/"/g, '""')}"`,
      s.created_at ? new Date(s.created_at).toLocaleDateString() : ''
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'series.csv';
    a.click();
    URL.revokeObjectURL(url);
  },

  abrirRatings: async (serieId, titulo) => {
    document.getElementById('rating-serie-id').value = serieId;
    document.getElementById('rating-modal-titulo').textContent = `★ ${titulo}`;
    document.getElementById('modal-rating').classList.remove('hidden');
    await App.cargarRatings(serieId);

    document.getElementById('btn-cerrar-rating').onclick = () => {
      document.getElementById('modal-rating').classList.add('hidden');
      document.getElementById('form-rating').reset();
    };

    document.getElementById('modal-rating').onclick = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        document.getElementById('modal-rating').classList.add('hidden');
        document.getElementById('form-rating').reset();
      }
    };

    document.getElementById('form-rating').onsubmit = async (e) => {
      e.preventDefault();
      const score = document.getElementById('rating-score').value;
      const comment = document.getElementById('rating-comment').value;
      await api.addRating(serieId, { score: parseFloat(score), comment });
      document.getElementById('form-rating').reset();
      await App.cargarRatings(serieId);
    };
  },

  cargarRatings: async (serieId) => {
    const data = await api.getRatings(serieId);
    const promedio = document.getElementById('rating-promedio');
    const lista = document.getElementById('lista-ratings');

    promedio.innerHTML = data.average
      ? `<div class="big-score">★ ${data.average}</div><p>${data.total} rating${data.total !== 1 ? 's' : ''}</p>`
      : `<p style="color: var(--text-muted)">Sin ratings todavía</p>`;

    if (data.ratings.length === 0) {
      lista.innerHTML = '';
      return;
    }

    lista.innerHTML = data.ratings.map(r => `
      <div class="rating-item">
        <div class="rating-item-left">
          <span class="rating-item-score">★ ${r.score}</span>
          ${r.comment ? `<span class="rating-item-comment">${r.comment}</span>` : ''}
        </div>
        <button class="rating-item-delete" data-action="delete-rating" data-serie-id="${serieId}" data-rating-id="${r.id}">✕</button>
      </div>
    `).join('');

    document.getElementById('lista-ratings').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="delete-rating"]');
      if (!btn) return;
      App.eliminarRating(btn.dataset.serieId, btn.dataset.ratingId);
    });
  },

  eliminarRating: async (serieId, ratingId) => {
    await api.deleteRating(serieId, ratingId);
    await App.cargarRatings(serieId);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());