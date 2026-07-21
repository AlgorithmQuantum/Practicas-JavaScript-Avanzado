// Importar paquetes instalados
const cowsay = require('cowsay');
const chalk = require('chalk');
const figlet = require('figlet');

// Importar nuestros datos planetarios
const planetas = require('./planetas');

// ===== FUNCIONES PRINCIPALES =====

// Función para mostrar todos los planetas
function mostrarPlanetas(detallado = false) {
  console.log(chalk.cyan('\n🚀 REGISTRO DE PLANETAS DESCUBIERTOS'));
  console.log(chalk.gray('═'.repeat(60)));
  
  if (planetas.length === 0) {
    console.log(chalk.yellow('📭 No hay planetas registrados aún.'));
    return;
  }
  
  planetas.forEach((planeta, index) => {
    console.log(chalk.green(`\n📡 #${index + 1}: ${chalk.bold(planeta.nombre)}`));
    console.log(chalk.white(`   📝 ${planeta.descripcion}`));
    console.log(chalk.gray(`   📅 Descubierto en: ${planeta.descubiertoEn}`));
    console.log(chalk.gray(`   🔭 Descubridor: ${planeta.descubridor}`));
    console.log(chalk.gray(`   🌍 Tipo: ${planeta.tipo}`));
    console.log(chalk.gray(`   📏 Distancia: ${planeta.distanciaTierra}`));
    
    if (detallado) {
      console.log(chalk.gray(`   📐 Diámetro: ${planeta.diametro}`));
      console.log(chalk.gray(`   🧬 Habitabilidad: ${planeta.habitabilidad}`));
      console.log(chalk.gray(`   🖼️ Imagen: ${planeta.imagen}`));
    }
    
    console.log(chalk.gray('   ' + '─'.repeat(40)));
  });
  
  console.log(chalk.cyan(`\n📊 Total: ${planetas.length} planetas registrados`));
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
  console.log(chalk.magenta('\n📊 ESTADÍSTICAS DE LA EXPLORACIÓN'));
  console.log(chalk.gray('═'.repeat(60)));
  
  const total = planetas.length;
  const tipos = {};
  const habitabilidades = {};
  
  planetas.forEach(p => {
    tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
    habitabilidades[p.habitabilidad] = (habitabilidades[p.habitabilidad] || 0) + 1;
  });
  
  console.log(chalk.white(`\n📌 Total de planetas: ${chalk.bold(total)}`));
  
  console.log(chalk.white('\n🌍 Clasificación por tipo:'));
  Object.entries(tipos).forEach(([tipo, cantidad]) => {
    console.log(chalk.gray(`   - ${tipo}: ${cantidad}`));
  });
  
  console.log(chalk.white('\n🧬 Potencial de habitabilidad:'));
  Object.entries(habitabilidades).forEach(([hab, cantidad]) => {
    const emoji = hab === 'Alta' ? '🟢' : hab === 'Potencial' ? '🟡' : '🔴';
    console.log(chalk.gray(`   ${emoji} ${hab}: ${cantidad}`));
  });
  
  // Encontrar el planeta más cercano y más lejano
  const distancias = planetas.map(p => {
    const num = parseFloat(p.distanciaTierra);
    return { nombre: p.nombre, distancia: num, unidad: p.distanciaTierra };
  }).filter(p => !isNaN(p.distancia));
  
  if (distancias.length > 0) {
    const masCercano = distancias.reduce((a, b) => a.distancia < b.distancia ? a : b);
    const masLejano = distancias.reduce((a, b) => a.distancia > b.distancia ? a : b);
    
    console.log(chalk.white('\n📏 Distancias:'));
    console.log(chalk.gray(`   📍 Más cercano: ${masCercano.nombre} (${masCercano.unidad})`));
    console.log(chalk.gray(`   📍 Más lejano: ${masLejano.nombre} (${masLejano.unidad})`));
  }
}

// Función para agregar un nuevo planeta (interactiva)
function agregarPlaneta() {
  console.log(chalk.cyan('\n🪐 AGREGAR NUEVO PLANETA'));
  console.log(chalk.gray('═'.repeat(60)));
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const preguntar = (pregunta) => new Promise(resolve => {
    readline.question(chalk.white(pregunta), respuesta => {
      resolve(respuesta);
    });
  });
  
  (async () => {
    try {
      const nombre = await preguntar('\n📛 Nombre del planeta: ');
      if (!nombre.trim()) {
        console.log(chalk.red('❌ El nombre es obligatorio.'));
        readline.close();
        return;
      }
      
      const descripcion = await preguntar('📝 Descripción: ');
      const descubiertoEn = await preguntar('📅 Año de descubrimiento: ');
      const descubridor = await preguntar('🔭 Descubridor: ');
      const tipo = await preguntar('🌍 Tipo (Planeta/Luna/Exoplaneta): ');
      const distancia = await preguntar('📏 Distancia a la Tierra: ');
      
      const nuevoPlaneta = {
        id: planetas.length + 1,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || 'Sin descripción',
        descubiertoEn: descubiertoEn.trim() || 'Desconocido',
        descubridor: descubridor.trim() || 'Anónimo',
        tipo: tipo.trim() || 'Desconocido',
        distanciaTierra: distancia.trim() || 'No especificada',
        diametro: 'No especificado',
        habitabilidad: 'Desconocida',
        imagen: 'No disponible'
      };
      
      planetas.push(nuevoPlaneta);
      console.log(chalk.green(`\n✅ ¡Planeta "${nombre}" registrado exitosamente!`));
      console.log(chalk.gray(`📊 Total de planetas: ${planetas.length}`));
      
    } catch (error) {
      console.log(chalk.red('❌ Error al agregar el planeta:', error.message));
    } finally {
      readline.close();
    }
  })();
}

// Función para mostrar ayuda
function mostrarAyuda() {
  console.log(chalk.cyan('\n📖 COMANDOS DE EXPLORACIÓN'));
  console.log(chalk.gray('═'.repeat(60)));
  console.log(chalk.white('npm run explorar') + chalk.gray(' - Muestra todos los planetas'));
  console.log(chalk.white('npm run explorar:detallado') + chalk.gray(' - Muestra información detallada'));
  console.log(chalk.white('npm run agregar') + chalk.gray(' - Agrega un nuevo planeta (interactivo)'));
  console.log(chalk.white('npm run stats') + chalk.gray(' - Muestra estadísticas de exploración'));
  console.log(chalk.white('npm run info') + chalk.gray(' - Muestra esta ayuda'));
  console.log(chalk.white('npm run cowsay') + chalk.gray(' - Mensaje divertido con cowsay'));
}

// Función de bienvenida con figlet
function mostrarBienvenida() {
  console.log(chalk.cyan(figlet.textSync('EXPLORADOR', { font: 'Standard' })));
  console.log(chalk.magenta('🌟 ¡Bienvenido al Registro Planetario! 🌟'));
  console.log(chalk.gray('═'.repeat(60)));
}

// ===== PROCESAMIENTO DE ARGUMENTOS =====

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const comando = args[0];

// Mostrar bienvenida
mostrarBienvenida();

// Menú de comandos
if (comando === '--detallado' || comando === '-d') {
  mostrarPlanetas(true);
} else if (comando === '--agregar' || comando === '-a') {
  agregarPlaneta();
} else if (comando === '--stats' || comando === '-s') {
  mostrarEstadisticas();
  // Mensaje con cowsay
  console.log(chalk.yellow(cowsay.say({
    text: '¡Estadísticas actualizadas!',
    e: 'oO',
    T: 'U '
  })));
} else if (comando === '--info' || comando === '-i' || comando === '--help' || comando === '-h') {
  mostrarAyuda();
} else {
  // Comportamiento por defecto: mostrar planetas
  mostrarPlanetas(false);
  
  // Mensaje con cowsay al final
  console.log(chalk.yellow(cowsay.say({
    text: `¡${planetas.length} planetas descubiertos! Continúa explorando...`,
    e: 'oO',
    T: 'U '
  })));
}

// Mostrar sugerencia de comandos si no hay argumentos
if (!comando) {
  console.log(chalk.gray('\n💡 Tip: Usa "npm run info" para ver todos los comandos disponibles'));
}

// Exportar funciones para uso en otros módulos
module.exports = {
  planetas,
  mostrarPlanetas,
  mostrarEstadisticas,
  agregarPlaneta,
  mostrarAyuda
};