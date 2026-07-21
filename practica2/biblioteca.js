// ===== 1. OBJETO JSON INICIAL =====
let biblioteca = {
    "libros": [
        { 
            "titulo": "Cien años de soledad", 
            "autor": "Gabriel García Márquez", 
            "genero": "Realismo mágico", 
            "disponible": true 
        },
        { 
            "titulo": "1984", 
            "autor": "George Orwell", 
            "genero": "Distopía", 
            "disponible": true 
        },
        { 
            "titulo": "El Hobbit", 
            "autor": "J.R.R. Tolkien", 
            "genero": "Fantasía", 
            "disponible": false 
        }
    ]
};

// ===== 2. SIMULAR LECTURA ASINCRÓNICA =====
function leerDatos(callback) {
    console.log("📖 Leyendo datos de la biblioteca...");
    setTimeout(() => {
        // Simulamos lectura de archivo JSON
        callback(biblioteca);
    }, 1000);
}

// ===== 4. SIMULAR ESCRITURA ASINCRÓNICA =====
function escribirDatos(nuevosDatos, callback) {
    console.log("💾 Guardando cambios en la biblioteca...");
    setTimeout(() => {
        biblioteca = nuevosDatos;
        callback(null, "Datos guardados exitosamente");
    }, 800);
}

// ===== 3. FUNCIONES PARA INTERACTUAR =====

// 3.1 Consultar inventario completo
function mostrarLibros() {
    leerDatos((datos) => {
        console.log("\n📚 INVENTARIO DE LIBROS");
        console.log("═".repeat(50));
        
        if (datos.libros.length === 0) {
            console.log("📭 No hay libros en la biblioteca");
            return;
        }
        
        datos.libros.forEach((libro, index) => {
            const estado = libro.disponible ? '✅ Disponible' : '❌ Prestado';
            console.log(`${index + 1}. "${libro.titulo}"`);
            console.log(`   Autor: ${libro.autor}`);
            console.log(`   Género: ${libro.genero}`);
            console.log(`   Estado: ${estado}`);
            console.log("-".repeat(40));
        });
    });
}

// 3.2 Consultar libros por género
function consultarPorGenero(genero) {
    leerDatos((datos) => {
        const filtrados = datos.libros.filter(libro => 
            libro.genero.toLowerCase() === genero.toLowerCase()
        );
        
        console.log(`\n📚 LIBROS DEL GÉNERO "${genero}"`);
        console.log("═".repeat(50));
        
        if (filtrados.length === 0) {
            console.log(`No hay libros del género "${genero}"`);
            return;
        }
        
        filtrados.forEach((libro, index) => {
            const estado = libro.disponible ? '✅ Disponible' : '❌ Prestado';
            console.log(`${index + 1}. "${libro.titulo}" - ${libro.autor} (${estado})`);
        });
    });
}

// 3.3 Agregar nuevo libro
function agregarLibro(titulo, autor, genero, disponible = true) {
    // Validaciones
    if (!titulo || !autor || !genero) {
        console.error("❌ Error: Faltan datos obligatorios (título, autor y género)");
        return;
    }
    
    // Verificar si el libro ya existe
    leerDatos((datos) => {
        const existe = datos.libros.some(libro => 
            libro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (existe) {
            console.error(`❌ El libro "${titulo}" ya existe en la biblioteca`);
            return;
        }
        
        // Crear nuevo libro
        const nuevoLibro = { 
            titulo, 
            autor, 
            genero, 
            disponible 
        };
        
        // Actualizar datos
        const nuevosDatos = {
            ...datos,
            libros: [...datos.libros, nuevoLibro]
        };
        
        // Guardar cambios
        escribirDatos(nuevosDatos, (error, mensaje) => {
            if (error) {
                console.error("❌ Error al guardar:", error);
                return;
            }
            console.log(`✅ Libro "${titulo}" agregado exitosamente`);
            console.log(`📊 Total de libros: ${nuevosDatos.libros.length}`);
        });
    });
}

// 3.4 Actualizar disponibilidad
function actualizarDisponibilidad(titulo, nuevoEstado) {
    if (typeof nuevoEstado !== 'boolean') {
        console.error("❌ Error: El estado debe ser true (disponible) o false (prestado)");
        return;
    }
    
    leerDatos((datos) => {
        const libroIndex = datos.libros.findIndex(libro => 
            libro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (libroIndex === -1) {
            console.error(`❌ Libro "${titulo}" no encontrado`);
            return;
        }
        
        const libro = datos.libros[libroIndex];
        const estadoAnterior = libro.disponible;
        
        // Actualizar disponibilidad
        const nuevosDatos = {
            ...datos,
            libros: datos.libros.map((libro, index) => 
                index === libroIndex 
                    ? { ...libro, disponible: nuevoEstado }
                    : libro
            )
        };
        
        // Guardar cambios
        escribirDatos(nuevosDatos, (error, mensaje) => {
            if (error) {
                console.error("❌ Error al guardar:", error);
                return;
            }
            
            const estadoTexto = nuevoEstado ? '✅ Disponible' : '❌ Prestado';
            const accion = nuevoEstado ? 'devuelto' : 'prestado';
            console.log(`✅ Libro "${titulo}" actualizado: ${estadoTexto}`);
            console.log(`📝 Estado anterior: ${estadoAnterior ? 'Disponible' : 'Prestado'}`);
        });
    });
}

// 3.5 Buscar libro por título
function buscarLibro(titulo) {
    leerDatos((datos) => {
        const libro = datos.libros.find(libro => 
            libro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        console.log(`\n🔍 BÚSQUEDA: "${titulo}"`);
        console.log("═".repeat(50));
        
        if (!libro) {
            console.log(`❌ Libro "${titulo}" no encontrado`);
            return;
        }
        
        const estado = libro.disponible ? '✅ Disponible' : '❌ Prestado';
        console.log(`📖 Título: ${libro.titulo}`);
        console.log(`✍️ Autor: ${libro.autor}`);
        console.log(`📚 Género: ${libro.genero}`);
        console.log(`📌 Estado: ${estado}`);
    });
}

// 3.6 Eliminar libro (extra)
function eliminarLibro(titulo) {
    leerDatos((datos) => {
        const existe = datos.libros.some(libro => 
            libro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (!existe) {
            console.error(`❌ Libro "${titulo}" no encontrado`);
            return;
        }
        
        const nuevosDatos = {
            ...datos,
            libros: datos.libros.filter(libro => 
                libro.titulo.toLowerCase() !== titulo.toLowerCase()
            )
        };
        
        escribirDatos(nuevosDatos, (error, mensaje) => {
            if (error) {
                console.error("❌ Error al guardar:", error);
                return;
            }
            console.log(`🗑️ Libro "${titulo}" eliminado exitosamente`);
            console.log(`📊 Total de libros: ${nuevosDatos.libros.length}`);
        });
    });
}

// ===== FUNCIONES DE AYUDA =====

// Estadísticas de la biblioteca
function estadisticasBiblioteca() {
    leerDatos((datos) => {
        const total = datos.libros.length;
        const disponibles = datos.libros.filter(l => l.disponible).length;
        const prestados = total - disponibles;
        
        // Agrupar por género
        const generos = {};
        datos.libros.forEach(libro => {
            generos[libro.genero] = (generos[libro.genero] || 0) + 1;
        });
        
        console.log("\n📊 ESTADÍSTICAS DE LA BIBLIOTECA");
        console.log("═".repeat(50));
        console.log(`📚 Total de libros: ${total}`);
        console.log(`✅ Disponibles: ${disponibles}`);
        console.log(`❌ Prestados: ${prestados}`);
        console.log("\n📋 Distribución por género:");
        Object.entries(generos).forEach(([genero, cantidad]) => {
            console.log(`   ${genero}: ${cantidad} libro(s)`);
        });
    });
}

// ===== EJECUCIÓN DE PRUEBAS =====

console.log("🚀 SISTEMA DE GESTIÓN DE BIBLIOTECA");
console.log("═".repeat(50));

// 1. Mostrar inventario inicial
mostrarLibros();

// 2. Agregar un nuevo libro
console.log("\n🔄 Agregando nuevo libro...");
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);

// 3. Actualizar disponibilidad (prestar un libro)
console.log("\n🔄 Actualizando disponibilidad...");
setTimeout(() => {
    actualizarDisponibilidad("1984", false);
}, 1500);

// 4. Consultar libros por género
setTimeout(() => {
    consultarPorGenero("Fantasía");
}, 2500);

// 5. Buscar un libro específico
setTimeout(() => {
    buscarLibro("Cien años de soledad");
}, 3500);

// 6. Mostrar estadísticas
setTimeout(() => {
    estadisticasBiblioteca();
}, 4500);

// 7. Intentar agregar un libro duplicado
setTimeout(() => {
    console.log("\n🔄 Intentando agregar libro duplicado...");
    agregarLibro("1984", "George Orwell", "Distopía", true);
}, 5500);

// 8. Eliminar un libro
setTimeout(() => {
    console.log("\n🔄 Eliminando libro...");
    eliminarLibro("El principito");
}, 6500);

// 9. Mostrar inventario final
setTimeout(() => {
    mostrarLibros();
}, 7500);