// ===== 1. DEFINIR ESQUEMA DE VALIDACIÓN CON ZOD =====

// Crear el esquema de validación
const userSchema = z.object({
    nombre: z.string()
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
        .max(50, { message: 'El nombre no puede tener más de 50 caracteres' })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
            message: 'El nombre solo puede contener letras y espacios' 
        })
        .transform(valor => valor.trim()),

    email: z.string()
        .email({ message: 'Ingrese un correo electrónico válido' })
        .min(1, { message: 'El correo electrónico es obligatorio' })
        .transform(valor => valor.toLowerCase().trim()),

    password: z.string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .max(30, { message: 'La contraseña no puede tener más de 30 caracteres' })
        .regex(/[A-Z]/, { 
            message: 'La contraseña debe tener al menos una mayúscula' 
        })
        .regex(/[a-z]/, { 
            message: 'La contraseña debe tener al menos una minúscula' 
        })
        .regex(/[0-9]/, { 
            message: 'La contraseña debe tener al menos un número' 
        })
        .regex(/[^A-Za-z0-9]/, {
            message: 'La contraseña debe tener al menos un carácter especial'
        })
});

// ===== 2. REFERENCIAS A ELEMENTOS DEL DOM =====

const form = document.getElementById('registrationForm');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const dataDisplay = document.getElementById('dataDisplay');
const testValidBtn = document.getElementById('testValidBtn');

// ===== 3. FUNCIONES PARA MOSTRAR ERRORES =====

function mostrarError(campoId, mensaje) {
    const errorElement = document.getElementById(`${campoId}-error`);
    const inputElement = document.getElementById(campoId);
    
    if (mensaje) {
        errorElement.textContent = mensaje;
        inputElement.classList.remove('success');
        inputElement.classList.add('error');
    } else {
        errorElement.textContent = '';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    }
}

function limpiarErrores() {
    ['nombre', 'email', 'password'].forEach(campo => {
        mostrarError(campo, null);
        const input = document.getElementById(campo);
        input.classList.remove('error', 'success');
    });
}

function mostrarErroresZod(error) {
    // Limpiar errores anteriores
    limpiarErrores();
    
    // Mostrar errores específicos de Zod
    if (error.errors) {
        error.errors.forEach(err => {
            const campo = err.path[0];
            if (campo) {
                mostrarError(campo, err.message);
            }
        });
    } else {
        // Error genérico
        console.error('Error desconocido:', error);
        alert('Ocurrió un error al validar los datos. Verifique la consola.');
    }
}

// ===== 4. FUNCIÓN PRINCIPAL DE VALIDACIÓN =====

function validarDatos(datos) {
    try {
        // Validar con Zod
        const resultado = userSchema.parse(datos);
        return { success: true, data: resultado };
    } catch (error) {
        // Si es un error de Zod
        if (error instanceof z.ZodError) {
            return { success: false, error: error };
        }
        // Otro tipo de error
        throw error;
    }
}

// ===== 5. VALIDACIÓN EN TIEMPO REAL =====

function validarCampoEnTiempoReal(campo, valor) {
    try {
        // Crear un esquema parcial para validar solo un campo
        const campoEsquema = userSchema.shape[campo];
        const resultado = campoEsquema.parse(valor);
        mostrarError(campo, null);
        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const mensaje = error.errors[0]?.message || 'Campo inválido';
            mostrarError(campo, mensaje);
        }
        return false;
    }
}

// Event listeners para validación en tiempo real
nombreInput.addEventListener('input', function() {
    validarCampoEnTiempoReal('nombre', this.value);
});

emailInput.addEventListener('input', function() {
    validarCampoEnTiempoReal('email', this.value);
});

passwordInput.addEventListener('input', function() {
    validarCampoEnTiempoReal('password', this.value);
});

// ===== 6. MANEJO DEL ENVÍO DEL FORMULARIO =====

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Mostrar loading
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Recopilar datos del formulario
    const datos = {
        nombre: nombreInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };
    
    console.log('📝 Datos a validar:', datos);
    
    // Validar datos con Zod
    const resultado = validarDatos(datos);
    
    // Ocultar loading
    submitBtn.disabled = false;
    loadingSpinner.style.display = 'none';
    
    if (resultado.success) {
        // ✅ Datos válidos
        console.log('✅ Datos válidos:', resultado.data);
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        dataDisplay.innerHTML = `
            <strong>📋 Datos registrados:</strong><br>
            👤 Nombre: ${resultado.data.nombre}<br>
            📧 Email: ${resultado.data.email}<br>
            🔒 Contraseña: ${'•'.repeat(resultado.data.password.length)}
        `;
        
        // Limpiar errores visuales
        limpiarErrores();
        
        // Deshabilitar campos
        nombreInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        submitBtn.disabled = true;
        
        // Scroll al mensaje de éxito
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } else {
        // ❌ Datos inválidos
        console.log('❌ Datos inválidos:', resultado.error);
        mostrarErroresZod(resultado.error);
        
        // Scroll al primer error
        const primerError = document.querySelector('.error');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
    }
});

// ===== 7. FUNCIÓN DE PRUEBA (validar sin enviar) =====

testValidBtn.addEventListener('click', function() {
    const datos = {
        nombre: nombreInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };
    
    console.log('🔍 Probando validación con:', datos);
    
    const resultado = validarDatos(datos);
    
    if (resultado.success) {
        console.log('✅ ¡Todos los datos son válidos!');
        alert('✅ ¡Todos los datos son válidos!\n\n' + 
            JSON.stringify(resultado.data, null, 2));
    } else {
        console.log('❌ Errores encontrados:', resultado.error);
        mostrarErroresZod(resultado.error);
        alert('❌ Hay errores en el formulario. Revise los campos resaltados.');
    }
});

// ===== 8. FUNCIONES DE UTILIDAD =====

// Mostrar el esquema en consola
console.log('📋 Esquema de validación Zod:');
console.log(userSchema);

// Función para resetear el formulario
function resetearFormulario() {
    form.reset();
    limpiarErrores();
    successMessage.style.display = 'none';
    nombreInput.disabled = false;
    emailInput.disabled = false;
    passwordInput.disabled = false;
    submitBtn.disabled = false;
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

// Hacer funciones disponibles globalmente
window.validarDatos = validarDatos;
window.resetearFormulario = resetearFormulario;

console.log('🚀 Formulario de registro con Zod cargado');
console.log('💡 Funciones disponibles en consola:');
console.log('  - validarDatos(datos) - Valida un objeto con el esquema');
console.log('  - resetearFormulario() - Reinicia el formulario');
console.log('  - userSchema - El esquema de validación');

// ===== 9. VALIDACIÓN INICIAL DE CAMPOS VACÍOS =====

// Mostrar ayuda visual cuando el campo pierde foco sin datos
['nombre', 'email', 'password'].forEach(campo => {
    const input = document.getElementById(campo);
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(campo, 'Este campo es obligatorio');
        } else {
            validarCampoEnTiempoReal(campo, this.value);
        }
    });
});

// ===== 10. MANEJO DE ERRORES GLOBALES =====

window.addEventListener('error', function(e) {
    console.error('Error global:', e);
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;
});

console.log('🎯 Zod está configurado correctamente');
console.log('📝 Ejemplo de uso: validarDatos({ nombre: "Juan", email: "juan@test.com", password: "Contraseña123!" })');