// ===== SELECCIONAR ELEMENTOS =====
const form = document.getElementById('eventForm');
const successMessage = document.getElementById('successMessage');

// ===== VALIDACIONES =====

// 1. Validar nombre (solo letras y espacios)
function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    return regex.test(nombre);
}

// 2. Validar email (formato estándar)
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// 3. Validar teléfono (formato flexible)
function validarTelefono(telefono) {
    // Acepta: 555-1234-567, 5551234567, +52 5551234567
    const regex = /^(\+\d{1,3}\s?)?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
    return regex.test(telefono);
}

// 4. Validar edad (entre 18 y 100)
function validarEdad(edad) {
    const num = Number(edad);
    return !isNaN(num) && Number.isInteger(num) && num >= 18 && num <= 100;
}

// 5. Validar país (no vacío)
function validarPais(pais) {
    return pais && pais.trim() !== '';
}

// 6. Validar fecha (no puede ser en el pasado)
function validarFecha(fecha) {
    if (!fecha) return false;
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada >= hoy;
}

// 7. Validar horario (no vacío)
function validarHorario(horario) {
    return horario && horario.trim() !== '';
}

// 8. Validar intereses (al menos uno seleccionado)
function validarIntereses() {
    const checkboxes = document.querySelectorAll('input[name="intereses"]:checked');
    return checkboxes.length > 0;
}

// 9. Validar términos (aceptado)
function validarTerminos() {
    const terminos = document.getElementById('terminos');
    return terminos.checked;
}

// 10. Validar documento (opcional, pero si se sube, validar tamaño y tipo)
function validarDocumento(file) {
    if (!file || file.length === 0) return true; // Opcional
    
    const fileObj = file[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (fileObj.size > maxSize) {
        return { valid: false, message: 'El documento no debe exceder los 5MB' };
    }
    
    if (!allowedTypes.includes(fileObj.type)) {
        return { valid: false, message: 'Formato no permitido. Use PDF, JPG o PNG' };
    }
    
    return { valid: true };
}

// ===== FUNCIONES DE VALIDACIÓN DE CAMPO =====

function validarCampo(id, validator, errorId) {
    const input = document.getElementById(id);
    const errorElement = document.getElementById(errorId);
    const valor = input.value.trim();
    
    const isValid = validator(valor);
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
        return true;
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        // Mensajes personalizados según el campo
        const mensajes = {
            nombre: 'El nombre debe tener entre 2 y 50 caracteres y solo letras',
            email: 'Ingrese un correo electrónico válido',
            telefono: 'Ingrese un número de teléfono válido',
            edad: 'La edad debe ser un número entre 18 y 100',
            pais: 'Por favor seleccione un país',
            fecha: 'La fecha debe ser hoy o en el futuro',
            horario: 'Por favor seleccione un horario'
        };
        errorElement.textContent = mensajes[id] || 'Campo inválido';
        return false;
    }
}

// ===== VALIDACIÓN ESPECIAL PARA INTERESES =====
function validarInteresesUI() {
    const errorElement = document.getElementById('intereses-error');
    const isValid = validarIntereses();
    
    if (!isValid) {
        errorElement.textContent = 'Seleccione al menos un interés';
    } else {
        errorElement.textContent = '';
    }
    
    return isValid;
}

// ===== VALIDACIÓN ESPECIAL PARA TÉRMINOS =====
function validarTerminosUI() {
    const errorElement = document.getElementById('terminos-error');
    const isValid = validarTerminos();
    
    if (!isValid) {
        errorElement.textContent = 'Debe aceptar los términos y condiciones';
    } else {
        errorElement.textContent = '';
    }
    
    return isValid;
}

// ===== VALIDACIÓN ESPECIAL PARA DOCUMENTO =====
function validarDocumentoUI() {
    const input = document.getElementById('documento');
    const errorElement = document.getElementById('documento-error');
    const files = input.files;
    
    if (files.length === 0) return true; // Opcional, no hay error
    
    const resultado = validarDocumento(files);
    
    if (resultado.valid) {
        errorElement.textContent = '';
        return true;
    } else {
        errorElement.textContent = resultado.message;
        return false;
    }
}

// ===== VALIDACIÓN COMPLETA DEL FORMULARIO =====

function validarFormulario() {
    const esNombreValido = validarCampo('nombre', validarNombre, 'nombre-error');
    const esEmailValido = validarCampo('email', validarEmail, 'email-error');
    const esTelefonoValido = validarCampo('telefono', validarTelefono, 'telefono-error');
    const esEdadValida = validarCampo('edad', validarEdad, 'edad-error');
    const esPaisValido = validarCampo('pais', validarPais, 'pais-error');
    const esFechaValida = validarCampo('fecha', validarFecha, 'fecha-error');
    const esHorarioValido = validarCampo('horario', validarHorario, 'horario-error');
    const sonInteresesValidos = validarInteresesUI();
    const sonTerminosValidos = validarTerminosUI();
    const esDocumentoValido = validarDocumentoUI();
    
    return (
        esNombreValido &&
        esEmailValido &&
        esTelefonoValido &&
        esEdadValida &&
        esPaisValido &&
        esFechaValida &&
        esHorarioValido &&
        sonInteresesValidos &&
        sonTerminosValidos &&
        esDocumentoValido
    );
}

// ===== EVENT LISTENERS PARA VALIDACIÓN EN TIEMPO REAL =====

// Validar campos mientras el usuario escribe
document.getElementById('nombre').addEventListener('input', function() {
    validarCampo('nombre', validarNombre, 'nombre-error');
});

document.getElementById('email').addEventListener('input', function() {
    validarCampo('email', validarEmail, 'email-error');
});

document.getElementById('telefono').addEventListener('input', function() {
    validarCampo('telefono', validarTelefono, 'telefono-error');
});

document.getElementById('edad').addEventListener('input', function() {
    validarCampo('edad', validarEdad, 'edad-error');
});

document.getElementById('pais').addEventListener('change', function() {
    validarCampo('pais', validarPais, 'pais-error');
});

document.getElementById('fecha').addEventListener('change', function() {
    validarCampo('fecha', validarFecha, 'fecha-error');
});

document.getElementById('horario').addEventListener('change', function() {
    validarCampo('horario', validarHorario, 'horario-error');
});

// Validar intereses cuando cambian
document.querySelectorAll('input[name="intereses"]').forEach(checkbox => {
    checkbox.addEventListener('change', validarInteresesUI);
});

// Validar términos
document.getElementById('terminos').addEventListener('change', validarTerminosUI);

// Validar documento
document.getElementById('documento').addEventListener('change', validarDocumentoUI);

// ===== ENVÍO DEL FORMULARIO =====

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir envío tradicional
    
    // Validar todo el formulario
    if (validarFormulario()) {
        // Simular envío de datos
        console.log('✅ Formulario válido. Enviando datos...');
        
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        
        // Obtener intereses seleccionados
        const intereses = document.querySelectorAll('input[name="intereses"]:checked');
        datos.intereses = Array.from(intereses).map(cb => cb.value);
        
        console.log('📊 Datos del registro:', datos);
        
        // Simular envío asíncrono
        setTimeout(() => {
            // Ocultar formulario y mostrar mensaje de éxito
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Animación de éxito
            successMessage.style.animation = 'fadeInUp 0.5s ease';
        }, 1000);
        
    } else {
        console.log('❌ Formulario con errores. Revise los campos.');
        
        // Scroll al primer error
        const primerError = document.querySelector('.error');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
    }
});

// ===== ANIMACIONES CON CSS =====
// Agregar estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .success-message {
        animation: fadeInUp 0.5s ease;
    }
`;
document.head.appendChild(style);

// ===== FUNCIONES DE UTILIDAD PARA DEPURACIÓN =====

function mostrarDatosFormulario() {
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData.entries());
    console.log('📋 Datos del formulario:', datos);
}

function limpiarValidaciones() {
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// ===== INICIALIZACIÓN =====

console.log('🚀 Formulario de Registro de Eventos cargado');
console.log('💡 Campos con validación en tiempo real:');
console.log('  - Nombre (solo letras)');
console.log('  - Email (formato estándar)');
console.log('  - Teléfono (formato flexible)');
console.log('  - Edad (18-100 años)');
console.log('  - País (selección obligatoria)');
console.log('  - Fecha (futuro o presente)');
console.log('  - Horario (selección obligatoria)');
console.log('  - Intereses (al menos uno)');
console.log('  - Términos (aceptación obligatoria)');
console.log('  - Documento (opcional, con validación de tipo/tamaño)');

console.log('📝 Puede usar estas funciones en consola:');
console.log('  - mostrarDatosFormulario()');
console.log('  - limpiarValidaciones()');