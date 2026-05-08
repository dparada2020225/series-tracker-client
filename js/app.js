const App = {
  series: [],
  filtroActual: 'todas',

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
        UI.renderSeries(App.series, App.filtroActual);
      });
    });

    let searchTimeout;
    document.getElementById('search').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        App.cargarSeries();
      }, 400);
    });

    document.getElementById('sort').addEventListener('change', () => App.cargarSeries());
    document.getElementById('order').addEventListener('change', () => App.cargarSeries());
  },

  cargarSeries: async () => {
    const lista = document.getElementById('lista-series');
    lista.innerHTML = '<p class="loading">Cargando series...</p>';

    const q = document.getElementById('search')?.value || '';
    const sort = document.getElementById('sort')?.value || 'created_at';
    const order = document.getElementById('order')?.value || 'desc';

    App.series = await api.getSeries({ q, sort, order });
    UI.renderSeries(App.series, App.filtroActual);
    UI.actualizarStats(App.series);
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
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());