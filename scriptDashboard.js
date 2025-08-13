// Función para inicializar datos si no existen
function initializeData() {
    if (!localStorage.getItem('parkingSystemData')) {
        const initialData = {
            malls: [
                {
                    id: "agora",
                    name: "Ágora Mall",
                    address: "Av. Abraham Lincoln, Santo Domingo",
                    levels: [
                        {
                            name: "Nivel 1",
                            spaces: [
                                { id: "A1", status: "available", size: "Estándar", distance: 150 },
                                { id: "A2", status: "available", size: "Estándar", distance: 145 },
                                { id: "A3", status: "occupied", size: "Estándar", distance: 140 },
                                { id: "A4", status: "available", size: "Grande", distance: 135 },
                                { id: "B1", status: "reserved", size: "Estándar", distance: 130 },
                                { id: "B2", status: "available", size: "Estándar", distance: 125 },
                                { id: "B3", status: "occupied", size: "Grande", distance: 120 },
                                { id: "B4", status: "available", size: "Estándar", distance: 115 },
                                { id: "C1", status: "available", size: "Estándar", distance: 110 },
                                { id: "C2", status: "reserved", size: "Grande", distance: 105 },
                                { id: "C3", status: "available", size: "Estándar", distance: 100 },
                                { id: "C4", status: "occupied", size: "Estándar", distance: 95 },
                                { id: "D1", status: "available", size: "Grande", distance: 90 },
                                { id: "D2", status: "available", size: "Estándar", distance: 85 },
                                { id: "D3", status: "reserved", size: "Estándar", distance: 80 },
                                { id: "D4", status: "available", size: "Grande", distance: 75 }
                            ]
                        },
                        {
                            name: "Nivel 2",
                            spaces: [
                                { id: "A1", status: "available", size: "Estándar", distance: 70 },
                                { id: "A2", status: "occupied", size: "Grande", distance: 65 },
                                { id: "A3", status: "available", size: "Estándar", distance: 60 },
                                { id: "A4", status: "available", size: "Estándar", distance: 55 },
                                { id: "B1", status: "reserved", size: "Grande", distance: 50 },
                                { id: "B2", status: "available", size: "Estándar", distance: 45 },
                                { id: "B3", status: "occupied", size: "Estándar", distance: 40 },
                                { id: "B4", status: "available", size: "Grande", distance: 35 },
                                { id: "C1", status: "available", size: "Estándar", distance: 30 },
                                { id: "C2", status: "reserved", size: "Estándar", distance: 25 },
                                { id: "C3", status: "available", size: "Grande", distance: 20 },
                                { id: "C4", status: "occupied", size: "Estándar", distance: 15 },
                                { id: "D1", status: "available", size: "Estándar", distance: 10 },
                                { id: "D2", status: "available", size: "Grande", distance: 5 },
                                { id: "D3", status: "reserved", size: "Estándar", distance: 10 },
                                { id: "D4", status: "available", size: "Estándar", distance: 15 }
                            ]
                        },
                        {
                            name: "Nivel 3",
                            spaces: [
                                { id: "A1", status: "available", size: "Grande", distance: 20 },
                                { id: "A2", status: "occupied", size: "Estándar", distance: 25 },
                                { id: "A3", status: "available", size: "Estándar", distance: 30 },
                                { id: "A4", status: "reserved", size: "Grande", distance: 35 },
                                { id: "B1", status: "available", size: "Estándar", distance: 40 },
                                { id: "B2", status: "available", size: "Estándar", distance: 45 },
                                { id: "B3", status: "occupied", size: "Grande", distance: 50 },
                                { id: "B4", status: "available", size: "Estándar", distance: 55 },
                                { id: "C1", status: "reserved", size: "Estándar", distance: 60 },
                                { id: "C2", status: "available", size: "Grande", distance: 65 },
                                { id: "C3", status: "available", size: "Estándar", distance: 70 },
                                { id: "C4", status: "occupied", size: "Estándar", distance: 75 },
                                { id: "D1", status: "available", size: "Grande", distance: 80 },
                                { id: "D2", status: "reserved", size: "Estándar", distance: 85 },
                                { id: "D3", status: "available", size: "Estándar", distance: 90 },
                                { id: "D4", status: "available", size: "Grande", distance: 95 }
                            ]
                        }
                    ],
                    stats: {
                        totalSpaces: 90,
                        availableSpaces: 30,
                        avgSearchTime: 6.5,
                        occupancyRate: 33,
                        activeReservations: 12
                    }
                },
                {
                    id: "sambil",
                    name: "Sambil Santo Domingo",
                    address: "Av. John F. Kennedy, Santo Domingo",
                    levels: [
                        // Estructura similar para Sambil
                    ],
                    stats: {
                        totalSpaces: 120,
                        availableSpaces: 45,
                        avgSearchTime: 8.2,
                        occupancyRate: 62,
                        activeReservations: 18
                    }
                }
            ],
            reservations: []
        };
        localStorage.setItem('parkingSystemData', JSON.stringify(initialData));
    }
}

// Función para obtener los datos
function getAppData() {
    return JSON.parse(localStorage.getItem('parkingSystemData'));
}

// Función para guardar datos
function saveAppData(data) {
    localStorage.setItem('parkingSystemData', JSON.stringify(data));
}

// Inicializamos los datos al cargar la página
initializeData();

document.addEventListener('DOMContentLoaded', function () {
    const appData = getAppData();

    // Generar espacios de estacionamiento basados en los datos JSON
    function generateParkingSpaces() {
        const currentMall = document.getElementById('mall-select').value;
        const mall = appData.malls.find(m => m.id === currentMall);

        const levelContents = document.querySelectorAll('.level-content');

        levelContents.forEach((content, index) => {
            content.innerHTML = ''; // Limpiar contenido existente

            if (mall && mall.levels[index]) {
                const level = mall.levels[index];

                level.spaces.forEach(space => {
                    const spaceElement = document.createElement('div');
                    spaceElement.className = `parking-space ${space.status}`;
                    spaceElement.textContent = space.id;
                    spaceElement.dataset.spaceId = space.id;
                    spaceElement.dataset.level = level.name;

                    spaceElement.addEventListener('click', function () {
                        selectSpace(this, space, level.name);
                    });

                    content.appendChild(spaceElement);
                });
            }
        });

        updateMallStats(mall);
    }

    // Función para seleccionar un espacio
    function selectSpace(element, spaceData, levelName) {
        // Deseleccionar todos los espacios primero
        document.querySelectorAll('.parking-space').forEach(s => {
            s.classList.remove('selected');
        });

        // Seleccionar el espacio clickeado
        element.classList.add('selected');

        // Actualizar detalles del espacio
        document.getElementById('selected-space').textContent = spaceData.id;
        document.getElementById('space-status').textContent =
            spaceData.status === 'available' ? 'Disponible' :
                spaceData.status === 'occupied' ? 'Ocupado' : 'Reservado';

        // Actualizar otros detalles
        const spaceDetails = document.querySelectorAll('.space-info div');
        spaceDetails[0].textContent = spaceData.id;
        spaceDetails[1].textContent = spaceData.status === 'available' ? 'Disponible' :
            spaceData.status === 'occupied' ? 'Ocupado' : 'Reservado';
        spaceDetails[2].textContent = spaceData.distance + " metros";
        spaceDetails[3].textContent = spaceData.size;

        // Cambiar color según estado
        const statusElement = document.getElementById('space-status');
        if (statusElement) {
            if (spaceData.status === 'available') {
                statusElement.style.color = '#2e7d32';
            } else if (spaceData.status === 'occupied') {
                statusElement.style.color = '#c62828';
            } else {
                statusElement.style.color = '#ef6c00';
            }
        }
    }

    // Función para actualizar estadísticas del centro comercial
    function updateMallStats(mall) {
        if (!mall) return;

        document.querySelector('.mall-logo').textContent = mall.name.substring(0, 2);
        document.querySelector('.mall-details h2').textContent = mall.name;
        document.querySelector('.mall-details p').textContent = mall.address;

        // Actualizar estadísticas
        document.querySelectorAll('.stat-value')[0].textContent = mall.stats.availableSpaces;
        document.querySelectorAll('.stat-value')[1].textContent = mall.stats.avgSearchTime + " min";
        document.querySelectorAll('.stat-value')[2].textContent = mall.stats.occupancyRate + "%";
        document.querySelectorAll('.stat-value')[3].textContent = mall.stats.activeReservations;

        // Actualizar barra de progreso
        const availablePercent = (mall.stats.availableSpaces / mall.stats.totalSpaces) * 100;
        document.querySelector('.progress').style.width = availablePercent + "%";
    }

    // Función para hacer una reserva
    function makeReservation() {
        const selectedSpace = document.querySelector('.parking-space.selected');
        if (!selectedSpace) {
            alert('Por favor selecciona un espacio primero');
            return;
        }

        const spaceId = selectedSpace.dataset.spaceId;
        const levelName = selectedSpace.dataset.level;
        const mallId = document.getElementById('mall-select').value;

        const mall = appData.malls.find(m => m.id === mallId);
        const level = mall.levels.find(l => l.name === levelName);
        const space = level.spaces.find(s => s.id === spaceId);

        if (space.status !== 'available') {
            alert('Este espacio no está disponible para reservar');
            return;
        }

        // Crear objeto de reserva
        const reservation = {
            id: Date.now(), // ID único basado en timestamp
            mall: mall.name,
            level: levelName,
            space: spaceId,
            date: new Date().toISOString(),
            status: 'active',
            user: 'Usuario Demo' // En una app real sería el usuario autenticado
        };

        // Actualizar estado del espacio
        space.status = 'reserved';
        mall.stats.availableSpaces--;
        mall.stats.occupancyRate = Math.round(((mall.stats.totalSpaces - mall.stats.availableSpaces) / mall.stats.totalSpaces) * 100);
        mall.stats.activeReservations++;

        // Agregar a historial de reservas
        appData.reservations.push(reservation);

        // Guardar cambios
        saveAppData(appData);

        // Actualizar UI
        selectedSpace.classList.remove('available');
        selectedSpace.classList.add('reserved');
        updateMallStats(mall);

        alert(`Reserva confirmada para espacio ${spaceId} en ${levelName}`);

        // Redirigir a página de historial
        window.location.href = 'historial.html';
    }

    // Configurar eventos
    document.getElementById('mall-select').addEventListener('change', generateParkingSpaces);
    document.querySelector('.btn-primary').addEventListener('click', makeReservation);

    // Configurar acordeón para niveles
    document.querySelectorAll('.level-header').forEach(header => {
        header.addEventListener('click', function () {
            const card = this.parentElement;
            const isActive = card.classList.contains('active');

            // Cerrar todas las tarjetas
            document.querySelectorAll('.level-card').forEach(c => {
                c.classList.remove('active');
            });

            // Abrir esta tarjeta si no estaba activa
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // Generar espacios iniciales
    generateParkingSpaces();
});