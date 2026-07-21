import './style.css';

// ===== CONFIGURACIÓN =====
const MIN_NUMERO = 1;
const MAX_NUMERO = 100;
let numeroSecreto;
let intentos = 0;
let juegoTerminado = false;
let historial = [];

// ===== REFERENCIAS AL DOM =====
const inputNumero = document.getElementById('numero');
const botonAdivinar = document.getElementById('adivinar');
const botonReiniciar = document.getElementById('reiniciar');
const mensajeDiv = document.getElementById('mensaje');
const intentosSpan = document.getElementById('intentos');
const rangoSpan = document.getElementById('rango');
const historialLista = document.getElementById('historialLista');

// ===== FUNCIONES PRINCIPALES =====

// Inicializar nuevo juego
function iniciarJuego() {
    numeroSecreto = Math.floor(Math.random() * (MAX_NUMERO - MIN_NUMERO + 1)) + MIN_NUMERO;
    intentos = 0;
    juegoTerminado = false;
    historial = [];
    
    // Actualizar UI
    inputNumero.value = '';
    inputNumero.disabled = false;
    inputNumero.focus();
    botonAdivinar.disabled = false;
    mensajeDiv.className = 'mensaje';
    mensajeDiv.textContent = '🎯 ¡Nuevo juego iniciado! Adivina el número entre 1 y 100';
    intentosSpan.textContent = `Intentos: 0`;
    rangoSpan.textContent = `Rango: ${MIN_NUMERO} - ${MAX_NUMERO}`;
    historialLista.innerHTML = '';
    
    // Agregar efecto visual
    mensajeDiv.classList.add('info');
    
    console.log('🎮 Nuevo juego - Número secreto:', numeroSecreto); // Para depuración
}

// Mostrar mensaje con estilo
function mostrarMensaje(texto, tipo = 'info') {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
}

// Agregar intento al historial
function agregarHistorial(numero, resultado, mensaje) {
    const intento = {
        numero,
        resultado,
        mensaje,
        intento: historial.length + 1
    };
    historial.push(intento);
    actualizarHistorialUI();
}

// Actualizar UI del historial
function actualizarHistorialUI() {
    historialLista.innerHTML = '';
    historial.forEach((item) => {
        const li = document.createElement('li');
        
        let claseResultado = '';
        let emoji = '';
        if (item.resultado === 'correcto') {
            claseResultado = 'resultado-correcto';
            emoji = '🎉';
        } else if (item.resultado === 'alto') {
            claseResultado = 'resultado-alto';
            emoji = '⬇️';
        } else if (item.resultado === 'bajo') {
            claseResultado = 'resultado-bajo';
            emoji = '⬆️';
        } else {
            claseResultado = 'resultado-invalido';
            emoji = '❌';
        }
        
        li.innerHTML = `
            <span>#${item.intento} <span class="numero-intento">${item.numero}</span></span>
            <span class="resultado-intento ${claseResultado}">${emoji} ${item.mensaje}</span>
        `;
        historialLista.appendChild(li);
    });
    
    // Scroll al último intento
    if (historialLista.lastElementChild) {
        historialLista.lastElementChild.scrollIntoView({ block: 'end' });
    }
}

// ===== LÓGICA PRINCIPAL DEL JUEGO =====

function adivinarNumero() {
    // Verificar si el juego terminó
    if (juegoTerminado) {
        mostrarMensaje('⛔ El juego ya terminó. Presiona "Nuevo juego" para jugar de nuevo', 'error');
        return;
    }
    
    // Obtener el número ingresado
    const numeroJugador = parseInt(inputNumero.value);
    
    // Validar entrada
    if (isNaN(numeroJugador) || !Number.isInteger(numeroJugador)) {
        mostrarMensaje('⚠️ Por favor, ingresa un número válido', 'error');
        inputNumero.value = '';
        inputNumero.focus();
        return;
    }
    
    if (numeroJugador < MIN_NUMERO || numeroJugador > MAX_NUMERO) {
        mostrarMensaje(`⚠️ El número debe estar entre ${MIN_NUMERO} y ${MAX_NUMERO}`, 'error');
        inputNumero.value = '';
        inputNumero.focus();
        return;
    }
    
    // Incrementar intentos
    intentos++;
    intentosSpan.textContent = `Intentos: ${intentos}`;
    
    // Comparar con el número secreto
    if (numeroJugador === numeroSecreto) {
        // ¡Ganaste!
        juegoTerminado = true;
        inputNumero.disabled = true;
        botonAdivinar.disabled = true;
        mostrarMensaje(`🎉 ¡Felicidades! ¡Adivinaste el número en ${intentos} intentos!`, 'exito');
        agregarHistorial(numeroJugador, 'correcto', '🎉 ¡Correcto!');
        return;
    } else if (numeroJugador < numeroSecreto) {
        mostrarMensaje(`⬆️ El número es más alto que ${numeroJugador}`, 'pista-baja');
        agregarHistorial(numeroJugador, 'bajo', `⬆️ Más alto`);
    } else {
        mostrarMensaje(`⬇️ El número es más bajo que ${numeroJugador}`, 'pista-alta');
        agregarHistorial(numeroJugador, 'alto', `⬇️ Más bajo`);
    }
    
    // Limpiar input y enfocar para el siguiente intento
    inputNumero.value = '';
    inputNumero.focus();
}

// ===== EVENT LISTENERS =====

botonAdivinar.addEventListener('click', adivinarNumero);

// Permitir enviar con Enter
inputNumero.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        adivinarNumero();
    }
});

botonReiniciar.addEventListener('click', () => {
    iniciarJuego();
});

// ===== FUNCIONALIDADES ADICIONALES =====

// 1. Pista visual de rango (actualizar dinámicamente)
inputNumero.addEventListener('input', function() {
    const valor = parseInt(this.value);
    if (!isNaN(valor) && valor >= MIN_NUMERO && valor <= MAX_NUMERO) {
        this.style.borderColor = '#4CAF50';
    } else if (this.value !== '') {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

// 2. Mostrar estadísticas en consola
function mostrarEstadisticas() {
    console.log('📊 Estadísticas del juego:');
    console.log(`  - Número secreto: ${numeroSecreto}`);
    console.log(`  - Intentos: ${intentos}`);
    console.log(`  - Estado: ${juegoTerminado ? 'Terminado' : 'En juego'}`);
    console.log(`  - Historial:`, historial);
}

// 3. Función para dar pista (opcional)
function darPista() {
    if (juegoTerminado) {
        mostrarMensaje('⛔ El juego ya terminó', 'error');
        return;
    }
    
    const pista = numeroSecreto % 2 === 0 ? 'par' : 'impar';
    mostrarMensaje(`💡 Pista: El número es ${pista}`, 'info');
}

// Hacer funciones disponibles en consola
window.mostrarEstadisticas = mostrarEstadisticas;
window.darPista = darPista;
window.iniciarJuego = iniciarJuego;

// ===== INICIALIZACIÓN =====

console.log('🎯 Juego "Adivina el número" cargado');
console.log('💡 Funciones disponibles en consola:');
console.log('  - iniciarJuego() - Reinicia el juego');
console.log('  - mostrarEstadisticas() - Muestra estadísticas');
console.log('  - darPista() - Muestra una pista');

// Iniciar el juego por primera vez
iniciarJuego();