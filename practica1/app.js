// ===== CONFIGURACIÓN INICIAL =====
const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');
const counter = document.getElementById('counter');
let orderId = 1;
let totalOrders = 0;

// ===== 2.1 RECEPCIÓN DE NUEVO PEDIDO =====
addOrderBtn.addEventListener('click', () => {
    // Generar pedido con ID único
    const order = { 
        id: orderId++, 
        status: 'En Proceso',
        createdAt: new Date().toLocaleTimeString()
    };
    
    // Actualizar contador
    totalOrders++;
    counter.textContent = `Pedidos totales: ${totalOrders}`;
    
    // Mostrar en interfaz
    addOrderToUI(order);
    
    // Iniciar proceso asíncrono
    processOrder(order);
});

// ===== 2.2 ACTUALIZACIÓN VISUAL =====
function addOrderToUI(order) {
    const listItem = document.createElement('li');
    listItem.id = `order-${order.id}`;
    listItem.innerHTML = `
        <span>
            <strong>Pedido #${order.id}</strong>
            <span class="timestamp">${order.createdAt}</span>
        </span>
        <span class="status-${order.status.toLowerCase().replace(' ', '-')}">
            ${order.status}
        </span>
    `;
    orderList.appendChild(listItem);
}

function updateOrderStatus(order, status) {
    const listItem = document.getElementById(`order-${order.id}`);
    if (listItem) {
        // Actualizar solo el estado visualmente
        const statusSpan = listItem.querySelector('span:last-child');
        statusSpan.textContent = status;
        statusSpan.className = `status-${status.toLowerCase().replace(' ', '-')}`;
        
        // Agregar efecto visual
        listItem.style.backgroundColor = status === 'Completado' ? '#e8f5e9' : '#fff3e0';
    }
}

// ===== 2.3 SIMULACIÓN DE PREPARACIÓN =====
// Función que retorna una Promise que se resuelve después de un tiempo aleatorio
function prepareOrder(order) {
    // Tiempo aleatorio entre 2 y 6 segundos (simula preparación)
    const preparationTime = Math.floor(Math.random() * 4000) + 2000;
    
    console.log(`🔄 Pedido #${order.id} en preparación... (${preparationTime/1000}s)`);
    
    return new Promise((resolve) => {
        // 4.1 USO DE setTimeout
        setTimeout(() => {
            resolve(`Pedido #${order.id} preparado`);
        }, preparationTime);
    });
}

// ===== 4.3 USO DE async/await =====
async function processOrder(order) {
    try {
        // 4.2 USO DE Promises con await
        const result = await prepareOrder(order);
        
        // Actualizar estado a Completado
        order.status = 'Completado';
        updateOrderStatus(order, 'Completado');
        
        console.log(`✅ ${result} - ¡Listo para servir!`);
        
        // Opcional: Notificación adicional
        if (totalOrders % 3 === 0) {
            console.log(`🎉 ¡Ya llevamos ${totalOrders} pedidos completados!`);
        }
        
    } catch (error) {
        console.error(`❌ Error procesando pedido #${order.id}:`, error);
        updateOrderStatus(order, 'Error');
    }
}

// ===== FUNCIONALIDAD EXTRA: Simular carga inicial =====
function loadInitialOrders() {
    const initialOrders = [1, 2, 3];
    initialOrders.forEach((_, index) => {
        setTimeout(() => {
            addOrderBtn.click();
        }, index * 300);
    });
}

// Cargar algunos pedidos iniciales después de 1 segundo
setTimeout(loadInitialOrders, 1000);

// ===== DEMOSTRACIÓN DEL EVENT LOOP =====
console.log('🚀 Sistema de pedidos iniciado');
console.log('⏳ El Event Loop manejará las tareas asíncronas...');

// Ejemplo de cómo el Event Loop prioriza tareas
setTimeout(() => {
    console.log('⏰ Tarea programada con setTimeout (macrotarea)');
}, 0);

Promise.resolve().then(() => {
    console.log('⚡ Promesa resuelta (microtarea) - se ejecuta antes que setTimeout');
});

console.log('📋 Código síncrono finalizado');