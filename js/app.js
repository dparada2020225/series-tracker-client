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
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());