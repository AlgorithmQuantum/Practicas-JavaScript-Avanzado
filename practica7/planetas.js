// Registro de planetas descubiertos
const planetas = [
  {
    id: 1,
    nombre: "Titán",
    descripcion: "La luna más grande de Saturno, con lagos de metano y una atmósfera densa.",
    descubiertoEn: "1655",
    descubridor: "Christiaan Huygens",
    tipo: "Luna",
    distanciaTierra: "1.2 mil millones km",
    diametro: "5,150 km",
    habitabilidad: "Potencial",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Titan_in_true_color.jpg/800px-Titan_in_true_color.jpg"
  },
  {
    id: 2,
    nombre: "Próxima Centauri b",
    descripcion: "Un exoplaneta rocoso en la zona habitable de la estrella más cercana al Sol.",
    descubiertoEn: "2016",
    descubridor: "Observatorio La Silla",
    tipo: "Exoplaneta",
    distanciaTierra: "4.24 años luz",
    diametro: "~1.3 veces la Tierra",
    habitabilidad: "Posible",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Proxima_Centauri_b_artist%27s_impression.jpg/800px-Proxima_Centauri_b_artist%27s_impression.jpg"
  },
  {
    id: 3,
    nombre: "Kepler-452b",
    descripcion: "Un exoplaneta similar a la Tierra, orbitando una estrella similar al Sol.",
    descubiertoEn: "2015",
    descubridor: "Misión Kepler",
    tipo: "Exoplaneta",
    distanciaTierra: "1,400 años luz",
    diametro: "1.6 veces la Tierra",
    habitabilidad: "Potencial",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Kepler-452b_artist_concept.jpg/800px-Kepler-452b_artist_concept.jpg"
  },
  {
    id: 4,
    nombre: "Europa",
    descripcion: "Luna de Júpiter con un océano subterráneo que podría albergar vida.",
    descubiertoEn: "1610",
    descubridor: "Galileo Galilei",
    tipo: "Luna",
    distanciaTierra: "628 millones km",
    diametro: "3,122 km",
    habitabilidad: "Alta",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Europa_%28moon%29.jpg/800px-Europa_%28moon%29.jpg"
  },
  {
    id: 5,
    nombre: "Marte",
    descripcion: "El planeta rojo, objetivo principal de la exploración espacial humana.",
    descubiertoEn: "Prehistórico",
    descubridor: "Observación antigua",
    tipo: "Planeta rocoso",
    distanciaTierra: "225 millones km",
    diametro: "6,779 km",
    habitabilidad: "Potencial (terraformación)",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/800px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png"
  },
  {
    id: 6,
    nombre: "Gliese 581g",
    descripcion: "Exoplaneta en la zona habitable de su estrella, potencialmente habitable.",
    descubiertoEn: "2010",
    descubridor: "Observatorio Lick",
    tipo: "Exoplaneta",
    distanciaTierra: "20.3 años luz",
    diametro: "1.3 veces la Tierra",
    habitabilidad: "Posible",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Artist%27s_impression_of_Gliese_581_g.jpg/800px-Artist%27s_impression_of_Gliese_581_g.jpg"
  }
];

// Exportar el array para usar en otros archivos
module.exports = planetas;