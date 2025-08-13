// Datos de ejemplo para el historial
const reservations = [
  {
    id: "RES-2023-001",
    mall: "Ágora Mall",
    space: "Nivel 3 - A4",
    date: "15/03/2023",
    time: "14:00 - 16:30",
    status: "completed",
    price: "RD$ 150"
  },
  {
    id: "RES-2023-002",
    mall: "Sambil Santo Domingo",
    space: "Nivel 2 - B1",
    date: "18/03/2023",
    time: "10:00 - 12:30",
    status: "upcoming",
    price: "RD$ 120"
  },
  {
    id: "RES-2023-003",
    mall: "Ágora Mall",
    space: "Nivel 1 - C3",
    date: "10/03/2023",
    time: "16:00 - 18:00",
    status: "cancelled",
    price: "RD$ 150"
  },
  {
    id: "RES-2023-004",
    mall: "Blue Mall",
    space: "Nivel 4 - D2",
    date: "20/03/2023",
    time: "11:30 - 14:00",
    status: "upcoming",
    price: "RD$ 180"
  },
  {
    id: "RES-2023-005",
    mall: "Ágora Mall",
    space: "Nivel 2 - A1",
    date: "05/03/2023",
    time: "09:00 - 11:30",
    status: "completed",
    price: "RD$ 120"
  }
];

// Función para renderizar las reservas
function renderReservations(filteredReservations = reservations) {
  const container = document.getElementById('reservations-list');

  if (filteredReservations.length === 0) {
    container.innerHTML = `
                    <div class="no-reservations">
                        <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>No se encontraron reservas con los filtros aplicados</p>
                    </div>
                `;
    return;
  }

  container.innerHTML = '';

  filteredReservations.forEach(reservation => {
    const statusClass = `status-${reservation.status}`;
    const cardClass = `reservation-card ${reservation.status}`;

    const card = document.createElement('div');
    card.className = cardClass;
    card.innerHTML = `
                    <div class="reservation-detail">
                        <span class="detail-label">Reserva #</span>
                        <span class="detail-value">${reservation.id}</span>
                    </div>
                    <div class="reservation-detail">
                        <span class="detail-label">Centro Comercial</span>
                        <span class="detail-value">${reservation.mall}</span>
                    </div>
                    <div class="reservation-detail">
                        <span class="detail-label">Fecha y Hora</span>
                        <span class="detail-value">${reservation.date} • ${reservation.time}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span class="reservation-status ${statusClass}">
                            ${getStatusText(reservation.status)}
                        </span>
                        <div style="display: flex; gap: 8px;">
                            <button class="action-btn btn-view">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            ${reservation.status === 'upcoming' ? `
                            <button class="action-btn btn-cancel">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            ` : ''}
                        </div>
                    </div>
                `;

    container.appendChild(card);
  });
}

// Función para obtener el texto del estado
function getStatusText(status) {
  const statusMap = {
    'completed': 'Completada',
    'upcoming': 'Próxima',
    'cancelled': 'Cancelada'
  };
  return statusMap[status] || status;
}

// Función para aplicar filtros
function applyFilters() {
  const statusFilter = document.getElementById('status-filter').value;
  const mallFilter = document.getElementById('mall-filter').value;
  const dateFrom = document.getElementById('date-from').value;
  const dateTo = document.getElementById('date-to').value;

  let filtered = reservations;

  // Filtrar por estado
  if (statusFilter !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter);
  }

  // Filtrar por centro comercial
  if (mallFilter !== 'all') {
    const mallMap = {
      'agora': 'Ágora Mall',
      'sambil': 'Sambil Santo Domingo',
      'blue': 'Blue Mall'
    };
    filtered = filtered.filter(r => r.mall === mallMap[mallFilter]);
  }

  // Filtrar por fecha (implementación básica)
  if (dateFrom) {
    // En una implementación real, compararías fechas reales
    filtered = filtered.filter(r => {
      // Esto es solo un ejemplo - necesitarías lógica de fecha real
      return true;
    });
  }

  renderReservations(filtered);
}

// Inicializar el historial
document.addEventListener('DOMContentLoaded', function () {
  renderReservations();

  // Configurar eventos de filtros
  document.getElementById('status-filter').addEventListener('change', applyFilters);
  document.getElementById('mall-filter').addEventListener('change', applyFilters);
  document.getElementById('date-from').addEventListener('change', applyFilters);
  document.getElementById('date-to').addEventListener('change', applyFilters);

  // Configurar fecha mínima/máxima (ejemplo)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date-from').max = today;
  document.getElementById('date-to').max = today;
});

// Función para ver detalles (ejemplo)
function showReservationDetails(reservationId) {
  // En una implementación real, esto mostraría un modal o llevaría a otra página
  console.log("Mostrando detalles de la reserva:", reservationId);
  alert(`Detalles de la reserva ${reservationId}`);
}