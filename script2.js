// Inicialización de la aplicación
    document.addEventListener('DOMContentLoaded', function() {
      // Configurar navegación
      setupNavigation();
      
      // Inicializar mapa
      initMap();
      
      // Inicializar gráficos del dashboard
      initDashboardCharts();
      
      // Event listeners
      setupEventListeners();
      
      // Cargar datos iniciales
      loadInitialData();
    });
    
    function setupNavigation() {
      // Navegación principal
      document.getElementById('nav-home').addEventListener('click', function() {
        showSection('home-section');
      });
      
      document.getElementById('nav-reservations').addEventListener('click', function() {
        showSection('reservations-section');
      });
      
      document.getElementById('nav-admin').addEventListener('click', function() {
        showSection('admin-section');
      });
      
      // Menú móvil
      document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
        }
      });
    }
    
    function showSection(sectionId) {
      // Ocultar todas las secciones
      document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
      });
      
      // Mostrar la sección seleccionada
      document.getElementById(sectionId).classList.add('active');
    }
    
    function initMap() {
      // Inicializar mapa usando Mapbox
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94ZXhhbXBsZXMiLCJhIjoiY2s1bGxtbjBwMDI4NTNlcGJ1MXhsbXhtdSJ9.gJ-xEFsk94F-0t3zNOCpKA';
      
      const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-69.9312, 18.4861], // Santo Domingo
        zoom: 18.5,
        pitch: 45,
        bearing: -17.6
      });
      
      map.on('load', function() {
        // Añadir edificio 3D para el centro comercial
        map.addLayer({
          'id': 'mall-building',
          'type': 'fill-extrusion',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {
                'height': 30
              },
              'geometry': {
                'type': 'Polygon',
                'coordinates': [
                  [
                    [-69.9312, 18.4861],
                    [-69.9302, 18.4861],
                    [-69.9302, 18.4871],
                    [-69.9312, 18.4871],
                    [-69.9312, 18.4861]
                  ]
                ]
              }
            }
          },
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.6
          }
        });
        
        // Añadir marcadores para espacios de parqueo
        addParkingSpots(map);
        
        // Añadir controles
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      });
    }
    
    function addParkingSpots(map) {
      // Simular espacios de parqueo en el mapa
      const parkingSpots = [
        { id: 'A-23', lat: -69.9307, lng: 18.4865, status: 'free' },
        { id: 'A-24', lat: -69.9308, lng: 18.4865, status: 'occupied' },
        { id: 'A-25', lat: -69.9309, lng: 18.4865, status: 'free' },
        { id: 'B-12', lat: -69.9307, lng: 18.4866, status: 'free' },
        { id: 'B-13', lat: -69.9308, lng: 18.4866, status: 'occupied' },
        { id: 'B-14', lat: -69.9309, lng: 18.4866, status: 'occupied' },
        { id: 'C-05', lat: -69.9307, lng: 18.4867, status: 'reserved' },
        { id: 'C-06', lat: -69.9308, lng: 18.4867, status: 'free' },
        { id: 'C-07', lat: -69.9309, lng: 18.4867, status: 'occupied' }
      ];
      
      parkingSpots.forEach(spot => {
        // Crear elemento para el marcador
        const el = document.createElement('div');
        el.className = 'parking-marker';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        
        // Establecer color según el estado
        if (spot.status === 'free') {
          el.style.backgroundColor = '#10b981'; // verde
          el.style.cursor = 'pointer';
        } else if (spot.status === 'occupied') {
          el.style.backgroundColor = '#ef4444'; // rojo
        } else {
          el.style.backgroundColor = '#f59e0b'; // amarillo
        }
        
        // Crear y añadir el marcador al mapa
        const marker = new mapboxgl.Marker(el)
          .setLngLat([spot.lat, spot.lng])
          .addTo(map);
        
        // Añadir popup con información
        if (spot.status === 'free') {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="text-sm">
                <p><strong>Espacio:</strong> ${spot.id}</p>
                <p><strong>Estado:</strong> <span class="text-green-600">Disponible</span></p>
                <button class="reserve-btn bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full mt-2" data-spot-id="${spot.id}">Reservar</button>
              </div>
            `);
          
          marker.setPopup(popup);
          
          // Event listener para el marcador
          el.addEventListener('click', () => {
            marker.togglePopup();
            setupReserveButtons();
          });
        }
      });
    }
    
    function setupReserveButtons() {
      // Configurar botones de reserva en los popups
      document.querySelectorAll('.reserve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const spotId = this.getAttribute('data-spot-id');
          showReservationModal(spotId);
        });
      });
    }
    
    function showReservationModal(spotId) {
      // Mostrar modal de confirmación de reserva
      const modal = document.getElementById('reservation-modal');
      document.getElementById('spot-location').textContent = `Nivel 1, ${spotId}`;
      
      // Calcular tiempo de expiración (15 min desde ahora)
      const now = new Date();
      const expiry = new Date(now.getTime() + 15 * 60000);
      document.getElementById('reservation-expiry').textContent = expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      modal.classList.remove('hidden');
      
      // Event listeners para el modal
      document.getElementById('close-modal').addEventListener('click', function() {
        modal.classList.add('hidden');
      });
      
      document.getElementById('cancel-reservation').addEventListener('click', function() {
        modal.classList.add('hidden');
      });
      
      document.getElementById('confirm-reservation').addEventListener('click', function() {
        // Simular llamada a la API para reservar
        modal.classList.add('hidden');
        showNotification('Reserva confirmada exitosamente');
        
        // Mostrar dirección después de reservar
        setTimeout(() => {
          showDirectionModal();
        }, 1000);
      });
    }
    
    function showDirectionModal() {
      // Mostrar modal con indicaciones de ruta
      const modal = document.getElementById('direction-modal');
      modal.classList.remove('hidden');
      
      // Inicializar mapa de dirección
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94ZXhhbXBsZXMiLCJhIjoiY2s1bGxtbjBwMDI4NTNlcGJ1MXhsbXhtdSJ9.gJ-xEFsk94F-0t3zNOCpKA';
      
      const directionMap = new mapboxgl.Map({
        container: 'direction-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-69.9312, 18.4861],
        zoom: 19.5
      });
      
      // Añadir ruta al mapa
      directionMap.on('load', function() {
        directionMap.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [-69.9315, 18.4858],
                [-69.9312, 18.4858],
                [-69.9312, 18.4861],
                [-69.9307, 18.4861],
                [-69.9307, 18.4865]
              ]
            }
          }
        });
        
        directionMap.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#2563eb',
            'line-width': 6,
            'line-dasharray': [0, 2]
          }
        });
        
        // Animación de la ruta
        let step = 0;
        const dashArraySequence = [
          [0, 2],
          [0.5, 1.5],
          [1, 1],
          [1.5, 0.5],
          [2, 0]
        ];
        
        function animateDashArray(timestamp) {
          // Actualizar el patrón de línea
          let newStep = parseInt((timestamp / 100) % dashArraySequence.length);
          if (newStep !== step) {
            step = newStep;
            directionMap.setPaintProperty('route', 'line-dasharray', dashArraySequence[step]);
          }
          requestAnimationFrame(animateDashArray);
        }
        
        requestAnimationFrame(animateDashArray);
      });
      
      // Event listeners para cerrar el modal
      document.getElementById('close-direction-modal').addEventListener('click', function() {
        modal.classList.add('hidden');
      });
      
      document.getElementById('close-directions').addEventListener('click', function() {
        modal.classList.add('hidden');
      });
    }
    
    function showNotification(message) {
      // Mostrar notificación
      const notification = document.getElementById('notification');
      document.getElementById('notification-message').textContent = message;
      
      notification.classList.add('show');
      
      // Ocultar después de 3 segundos
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
    
    function setupEventListeners() {
      // Event listeners para los botones de nivel
      document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          // Remover clase activa de todos los botones
          document.querySelectorAll('.level-btn').forEach(b => {
            b.classList.remove('active');
          });
          
          // Añadir clase activa al botón seleccionado
          this.classList.add('active');
          
          // Aquí se cargarían los datos del nivel seleccionado
          const levelId = this.getAttribute('data-level');
          loadLevelData(levelId);
        });
      });
      
      // Event listener para cambio de centro comercial
      document.getElementById('mall-select').addEventListener('change', function() {
        const mallId = this.value;
        loadMallData(mallId);
      });
    }
    
    function loadLevelData(levelId) {
      // Simulación de carga de datos por nivel
      const loadingStates = {
        'level-1': { free: 45, total: 60 },
        'level-2': { free: 22, total: 50 },
        'level-3': { free: 18, total: 45 },
        'level-4': { free: 30, total: 45 }
      };
      
      const data = loadingStates[levelId];
      if (data) {
        document.getElementById('available-spots').textContent = data.free;
        document.getElementById('occupancy-rate').textContent = Math.round((1 - data.free / data.total) * 100) + '%';
      }
    }
    
    function loadMallData(mallId) {
      // Simulación de carga de datos por centro comercial
      console.log(`Cargando datos para: ${mallId}`);
      // Aquí se actualizaría el mapa y las estadísticas
    }
    
    function loadInitialData() {
      // Cargar datos iniciales
      document.getElementById('available-spots').textContent = '45';
      document.getElementById('avg-time').textContent = '3.5 min';
      document.getElementById('occupancy-rate').textContent = '75%';
    }
    
    function initDashboardCharts() {
      // Gráfico de ocupación por hora
      const occupancyCtx = document.getElementById('occupancy-chart');
      if (occupancyCtx) {
        new Chart(occupancyCtx, {
          type: 'line',
          data: {
            labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'],
            datasets: [{
              label: 'Porcentaje de Ocupación',
              data: [20, 35, 50, 65, 75, 80, 85, 82, 78, 85, 90, 95, 75],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      }
      
      // Gráfico de distribución por nivel
      const distributionCtx = document.getElementById('distribution-chart');
      if (distributionCtx) {
        new Chart(distributionCtx, {
          type: 'doughnut',
          data: {
            labels: ['Nivel 1', 'Nivel 2', 'Sótano B1', 'Sótano B2'],
            datasets: [{
              data: [25, 28, 27, 20],
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }