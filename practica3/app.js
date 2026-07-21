// ===== CONFIGURACIÓN =====
const API_URL = 'https://rickandmortyapi.com/api/character';
const dataContainer = document.getElementById('data-container');
const statusDiv = document.getElementById('status');
const fetchBtn = document.getElementById('fetchBtn');
const axiosBtn = document.getElementById('axiosBtn');
const clearBtn = document.getElementById('clearBtn');

// ===== FUNCIONES DE UTILIDAD =====

// Mostrar mensaje de estado
function showStatus(message, type = 'loading') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
}

// Ocultar mensaje de estado
function hideStatus() {
    statusDiv.style.display = 'none';
}

// Mostrar personajes en el contenedor
function displayCharacters(characters) {
    // Limpiar contenedor
    dataContainer.innerHTML = '';
    
    if (!characters || characters.length === 0) {
        dataContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No se encontraron personajes</p>';
        return;
    }
    
    // Crear tarjetas para cada personaje
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        // Determinar clase de estado
        let statusClass = 'status-unknown';
        if (character.status === 'Alive') statusClass = 'status-alive';
        else if (character.status === 'Dead') statusClass = 'status-dead';
        
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" loading="lazy">
            <div class="character-info">
                <h3>${character.name}</h3>
                <p>
                    <span class="status-indicator ${statusClass}"></span>
                    ${character.status} - ${character.species}
                </p>
                <p>📍 ${character.location.name}</p>
                <p>🎬 ${character.episode.length} episodios</p>
            </div>
        `;
        
        dataContainer.appendChild(card);
    });
}

// ===== FUNCIÓN CON FETCH =====

async function fetchCharacters() {
    // Deshabilitar botones durante la carga
    fetchBtn.disabled = true;
    axiosBtn.disabled = true;
    
    try {
        showStatus('⏳ Cargando personajes con Fetch...', 'loading');
        
        // Realizar solicitud con fetch
        const response = await fetch(API_URL);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parsear respuesta JSON
        const data = await response.json();
        
        // Mostrar personajes
        displayCharacters(data.results);
        
        showStatus(`✅ ${data.results.length} personajes cargados con Fetch`, 'success');
        
        // Mostrar badge en la consola
        console.log('📊 Datos obtenidos con Fetch:', data);
        
    } catch (error) {
        console.error('❌ Error en Fetch:', error);
        showStatus(`❌ Error: ${error.message}`, 'error');
        dataContainer.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #721c24;">
            Error al cargar los datos: ${error.message}
        </p>`;
    } finally {
        // Rehabilitar botones
        fetchBtn.disabled = false;
        axiosBtn.disabled = false;
    }
}

// ===== FUNCIÓN CON AXIOS =====

async function fetchCharactersWithAxios() {
    // Deshabilitar botones durante la carga
    fetchBtn.disabled = true;
    axiosBtn.disabled = true;
    
    try {
        showStatus('⚡ Cargando personajes con Axios...', 'loading');
        
        // Realizar solicitud con Axios
        const response = await axios.get(API_URL);
        
        // Axios automáticamente parsea JSON y verifica el status
        // Los datos están en response.data
        const data = response.data;
        
        // Mostrar personajes
        displayCharacters(data.results);
        
        showStatus(`✅ ${data.results.length} personajes cargados con Axios`, 'success');
        
        // Mostrar badge en la consola
        console.log('📊 Datos obtenidos con Axios:', data);
        console.log('🔍 Información de la respuesta Axios:', {
            status: response.status,
            headers: response.headers,
            config: response.config
        });
        
    } catch (error) {
        console.error('❌ Error en Axios:', error);
        
        // Manejo específico de errores de Axios
        let errorMessage = error.message;
        if (error.response) {
            // El servidor respondió con un código de error
            errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            // No se recibió respuesta
            errorMessage = 'No se pudo conectar con el servidor';
        }
        
        showStatus(`❌ Error: ${errorMessage}`, 'error');
        dataContainer.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #721c24;">
            Error al cargar los datos: ${errorMessage}
        </p>`;
    } finally {
        // Rehabilitar botones
        fetchBtn.disabled = false;
        axiosBtn.disabled = false;
    }
}

// ===== LIMPIAR CONTENIDO =====

function clearData() {
    dataContainer.innerHTML = '';
    hideStatus();
    console.log('🗑️ Contenido limpiado');
}

// ===== CARGA INICIAL AUTOMÁTICA =====

async function loadInitialData() {
    // Mostrar mensaje de carga inicial
    showStatus('🔄 Cargando personajes iniciales...', 'loading');
    
    try {
        // Usar fetch para carga inicial
        const response = await fetch(API_URL);
        const data = await response.json();
        displayCharacters(data.results);
        showStatus(`✅ ${data.results.length} personajes cargados`, 'success');
    } catch (error) {
        console.error('Error en carga inicial:', error);
        showStatus('❌ Error al cargar datos iniciales', 'error');
        dataContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error al cargar los datos. Intenta con los botones.</p>';
    }
}

// ===== EVENT LISTENERS =====

fetchBtn.addEventListener('click', fetchCharacters);
axiosBtn.addEventListener('click', fetchCharactersWithAxios);
clearBtn.addEventListener('click', clearData);

// ===== INICIALIZACIÓN =====

console.log('🚀 Aplicación iniciada');
console.log('📋 API URL:', API_URL);
console.log('💡 Usa los botones para comparar Fetch y Axios');

// Cargar datos iniciales
loadInitialData();

// ===== COMPARATIVA DE CARACTERÍSTICAS =====

console.log('\n📊 COMPARATIVA FETCH vs AXIOS:');
console.log('═══════════════════════════════════');
console.log('🔹 FETCH:');
console.log('  ✅ Nativo del navegador');
console.log('  ✅ Ligero (sin dependencias)');
console.log('  ❌ Requiere verificar response.ok manualmente');
console.log('  ❌ No maneja errores HTTP automáticamente');
console.log('  ❌ Necesita parsear JSON manualmente');
console.log('\n🔹 AXIOS:');
console.log('  ✅ Sintaxis más limpia');
console.log('  ✅ Maneja automáticamente errores HTTP');
console.log('  ✅ Parseo automático de JSON');
console.log('  ✅ Interceptores de peticiones/respuestas');
console.log('  ✅ Mayor compatibilidad con navegadores antiguos');
console.log('  ❌ Requiere instalar/importar la librería');