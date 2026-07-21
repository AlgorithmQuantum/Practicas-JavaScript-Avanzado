// ===== CONFIGURACIÓN INICIAL =====
const MESAS_DISPONIBLES = 10; // Total de mesas en el restaurante
let reservasActivas = 0; // Contador de reservas actuales

// ===== 1. VERIFICAR DISPONIBILIDAD DE MESAS =====
function verificarDisponibilidad(mesasSolicitadas) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Verificando disponibilidad para ${mesasSolicitadas} mesa(s)...`);
        
        // Simular tiempo de verificación
        setTimeout(() => {
            const mesasDisponibles = MESAS_DISPONIBLES - reservasActivas;
            
            if (mesasSolicitadas <= 0) {
                reject(new Error('❌ El número de mesas debe ser mayor a 0'));
                return;
            }
            
            if (mesasSolicitadas <= mesasDisponibles) {
                console.log(`✅ ${mesasSolicitadas} mesa(s) disponible(s)`);
                resolve({
                    disponibles: true,
                    mesasDisponibles: mesasDisponibles,
                    mesasSolicitadas: mesasSolicitadas
                });
            } else {
                reject(new Error(
                    `❌ No hay suficientes mesas disponibles. ` +
                    `Solicitadas: ${mesasSolicitadas}, ` +
                    `Disponibles: ${mesasDisponibles}`
                ));
            }
        }, 1500); // Simular delay de 1.5 segundos
    });
}

// ===== 2. SIMULAR ENVÍO DE CONFIRMACIÓN POR CORREO =====
function enviarConfirmacionReserva(nombreCliente, detallesReserva) {
    return new Promise((resolve, reject) => {
        console.log(`📧 Enviando correo de confirmación a ${nombreCliente}...`);
        
        // Simular tiempo de envío
        setTimeout(() => {
            // 80% de probabilidad de éxito, 20% de error
            const exito = Math.random() < 0.8;
            
            if (exito) {
                const mensaje = `
                    ✅ Correo enviado exitosamente a ${nombreCliente}
                    📋 Detalles de la reserva:
                    - ${detallesReserva.mesasSolicitadas} mesa(s)
                    - Fecha: ${new Date().toLocaleString()}
                    - Código de confirmación: ${generarCodigoConfirmacion()}
                `;
                console.log(mensaje);
                resolve({
                    enviado: true,
                    mensaje: mensaje,
                    codigo: generarCodigoConfirmacion()
                });
            } else {
                reject(new Error(`❌ Error al enviar el correo a ${nombreCliente}. Intente nuevamente.`));
            }
        }, 1200); // Simular delay de 1.2 segundos
    });
}

// ===== FUNCIÓN AUXILIAR: Generar código de confirmación =====
function generarCodigoConfirmacion() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let codigo = '';
    
    for (let i = 0; i < 4; i++) {
        codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 4; i++) {
        codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    return codigo;
}

// ===== 3. CONTROL DE FLUJO EN LA FUNCIÓN PRINCIPAL =====
async function hacerReserva(nombreCliente, mesasSolicitadas) {
    console.log('\n' + '='.repeat(60));
    console.log(`📝 NUEVA RESERVA: ${nombreCliente} - ${mesasSolicitadas} mesa(s)`);
    console.log('='.repeat(60));
    
    try {
        // Validar datos de entrada
        if (!nombreCliente || nombreCliente.trim() === '') {
            throw new Error('❌ El nombre del cliente es obligatorio');
        }
        
        if (mesasSolicitadas <= 0) {
            throw new Error('❌ El número de mesas debe ser mayor a 0');
        }
        
        // 3.1 Verificar disponibilidad de mesas
        const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);
        
        // 3.2 Si hay disponibilidad, reservar mesas
        reservasActivas += mesasSolicitadas;
        console.log(`📊 Mesas reservadas actualmente: ${reservasActivas}/${MESAS_DISPONIBLES}`);
        
        // 3.3 Enviar correo de confirmación
        const confirmacion = await enviarConfirmacionReserva(nombreCliente, disponibilidad);
        
        // 3.4 Mostrar resultado final
        console.log('\n🎉 ¡RESERVA CONFIRMADA EXITOSAMENTE!');
        console.log(`👤 Cliente: ${nombreCliente}`);
        console.log(`🍽️ Mesas: ${mesasSolicitadas}`);
        console.log(`🔑 Código: ${confirmacion.codigo}`);
        console.log('='.repeat(60));
        
        return {
            exitoso: true,
            cliente: nombreCliente,
            mesas: mesasSolicitadas,
            codigo: confirmacion.codigo,
            mensaje: 'Reserva confirmada exitosamente'
        };
        
    } catch (error) {
        // 3.5 Manejo de errores
        console.log('\n❌ ERROR EN LA RESERVA:');
        console.log(`🔴 ${error.message}`);
        console.log('='.repeat(60));
        
        // No olvidar liberar las mesas si la reserva falló después de reservar
        if (error.message.includes('correo')) {
            reservasActivas -= mesasSolicitadas;
            console.log(`🔄 Mesas liberadas: ${mesasSolicitadas} (total: ${reservasActivas})`);
        }
        
        return {
            exitoso: false,
            cliente: nombreCliente,
            mesas: mesasSolicitadas,
            error: error.message
        };
    }
}

// ===== 4. FUNCIONES DE PRUEBA Y ESTADÍSTICAS =====

// Mostrar estado actual del restaurante
function mostrarEstadoRestaurante() {
    console.log('\n📊 ESTADO DEL RESTAURANTE');
    console.log('='.repeat(40));
    console.log(`🏢 Total de mesas: ${MESAS_DISPONIBLES}`);
    console.log(`📌 Mesas reservadas: ${reservasActivas}`);
    console.log(`✅ Mesas disponibles: ${MESAS_DISPONIBLES - reservasActivas}`);
    console.log('='.repeat(40));
}

// Reiniciar el sistema (para pruebas)
function reiniciarSistema() {
    reservasActivas = 0;
    console.log('\n🔄 Sistema reiniciado. Todas las mesas están disponibles.');
    mostrarEstadoRestaurante();
}

// ===== 5. PRUEBAS DEL SISTEMA =====

async function ejecutarPruebas() {
    console.log('🚀 INICIANDO PRUEBAS DEL SISTEMA DE RESERVAS');
    console.log('='.repeat(60));
    
    // Mostrar estado inicial
    mostrarEstadoRestaurante();
    
    // Prueba 1: Reserva exitosa (4 mesas)
    console.log('\n📋 PRUEBA 1: Reserva exitosa');
    await hacerReserva('Juan Pérez', 4);
    
    // Prueba 2: Reserva exitosa (2 mesas)
    console.log('\n📋 PRUEBA 2: Reserva exitosa');
    await hacerReserva('María García', 2);
    
    // Prueba 3: Reserva con mesas insuficientes
    console.log('\n📋 PRUEBA 3: Reserva con mesas insuficientes');
    await hacerReserva('Carlos López', 8);
    
    // Prueba 4: Reserva con datos inválidos
    console.log('\n📋 PRUEBA 4: Reserva con datos inválidos');
    await hacerReserva('', 3);
    
    // Prueba 5: Reserva con número negativo
    console.log('\n📋 PRUEBA 5: Reserva con número negativo');
    await hacerReserva('Ana Martínez', -2);
    
    // Prueba 6: Reserva que simula error en correo
    console.log('\n📋 PRUEBA 6: Simulación de error en correo (puede fallar)');
    await hacerReserva('Pedro Ramírez', 2);
    
    // Mostrar estado final
    console.log('\n📊 ESTADO FINAL DEL RESTAURANTE');
    mostrarEstadoRestaurante();
    
    // Estadísticas de pruebas
    console.log('\n📈 ESTADÍSTICAS DE PRUEBAS');
    console.log('='.repeat(40));
    console.log(`ℹ️ Se realizaron 6 pruebas con diferentes escenarios`);
    console.log(`💡 Observa cómo el sistema maneja:`);
    console.log(`   ✅ Reservas exitosas`);
    console.log(`   ❌ Falta de disponibilidad`);
    console.log(`   ❌ Datos inválidos`);
    console.log(`   ❌ Errores en el envío de correos`);
    console.log('='.repeat(60));
}

// ===== 6. FUNCIONES PARA USO INTERACTIVO =====

// Función para hacer una reserva desde la consola
async function reservarInteractivo(nombre, mesas) {
    const resultado = await hacerReserva(nombre, mesas);
    return resultado;
}

// Función para consultar disponibilidad
function consultarDisponibilidad() {
    const disponibles = MESAS_DISPONIBLES - reservasActivas;
    console.log(`\n📊 Disponibilidad actual: ${disponibles} mesas de ${MESAS_DISPONIBLES}`);
    return disponibles;
}

// ===== EXPORTAR FUNCIONES (para módulos) =====
// Si se usa con Node.js, descomentar:
// module.exports = {
//     hacerReserva,
//     mostrarEstadoRestaurante,
//     reiniciarSistema,
//     consultarDisponibilidad,
//     ejecutarPruebas
// };

// ===== EJECUCIÓN AUTOMÁTICA DE PRUEBAS =====
// Si el archivo se ejecuta directamente
if (typeof require !== 'undefined' && require.main === module) {
    ejecutarPruebas();
}

// Si se ejecuta en navegador
if (typeof window !== 'undefined') {
    window.hacerReserva = hacerReserva;
    window.mostrarEstadoRestaurante = mostrarEstadoRestaurante;
    window.reiniciarSistema = reiniciarSistema;
    window.consultarDisponibilidad = consultarDisponibilidad;
    window.ejecutarPruebas = ejecutarPruebas;
    
    console.log('💡 Funciones disponibles en la consola:');
    console.log('  - hacerReserva(nombre, mesas)');
    console.log('  - mostrarEstadoRestaurante()');
    console.log('  - reiniciarSistema()');
    console.log('  - consultarDisponibilidad()');
    console.log('  - ejecutarPruebas()');
}

console.log('🌟 Sistema de Reservas del Restaurante cargado correctamente');
console.log('💡 Ejecuta "ejecutarPruebas()" para ver el sistema en acción');