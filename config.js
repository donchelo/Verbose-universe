// ===============================
// CONFIG.JS - CONFIGURACIONES Y CONSTANTES
// ===============================

// Verificar que estamos en el entorno correcto
if (typeof window !== 'undefined') {
  console.log("✓ config.js cargado");
}

// Objeto global de configuración
window.CONFIG = {
  // Configuración del canvas
  canvas: {
    width: 1200,
    height: 700,
    backgroundColor: [250, 250, 250]
  },
  
  // Configuración de la criatura
  criatura: {
    // Estructura corporal
    numeroSegmentos: 7,
    distanciaSegmentos: 25,
    
    // Tamaños basados en ley de tercios
    tamaños: {
      grande: 50,
      medio: 30,
      pequeño: 15
    },
    
    // Patrón de distribución de tamaños
    patronTamaños: ['grande', 'medio', 'pequeño', 'grande', 'medio', 'pequeño', 'pequeño'],
    
    // Movimiento
    velocidadMovimiento: 2,
    velocidadTiempo: 0.02,
    
    // Ondulación corporal
    amplitudOndulacion: 15,
    velocidadOndulacion: 3,
    factorDesfase: 0.8,
    
    // Respiración/pulsación
    velocidadRespiracion: 4,
    amplitudRespiracion: 0.15,
    
    // Deformación muscular
    velocidadDeformacion: [2, 2.5],
    amplitudDeformacion: [0.2, 0.15],
    
    // Apariencia
    color: [20, 20, 20], // RGB Negro
    grosorConexiones: 2,
    grosorContorno: 1,
    
    // Cabeza y tentáculos
    cabeza: {
      numeroTentaculos: 3,
      longitudTentaculos: 30,
      segmentosTentaculos: 4,
      grosorTentaculos: 3,
      tamañoPuntas: 4,
      amplitudMovimiento: 0.3,
      velocidadMovimiento: 3
    }
  },
  
  // Configuración de interactividad
  interaccion: {
    distanciaReaccion: 100,
    fuerzaEscape: 2,
    suavidadSeguimiento: 0.15
  },
  
  // Configuración de límites
  limites: {
    margen: 50,
    factorRebote: -0.5
  },
  
  // Configuración de UI
  ui: {
    panel: {
      x: 20,
      y: 20,
      width: 220,
      height: 460,
      visible: true
    },
    
    controles: {
      width: 120,
      height: 12,
      spacing: 20,
      margen: 5
    },
    
    botones: {
      width: 35,
      height: 20,
      widthSmall: 20
    },
    
    colores: {
      fondo: [255, 255, 255, 240],
      borde: [220],
      texto: [60],
      textoSecundario: [120],
      info: [80]
    }
  }
};

// También crear alias global sin window para compatibilidad
if (typeof window !== 'undefined') {
  window.CONFIG = window.CONFIG;
  // Hacer CONFIG disponible globalmente
  if (typeof global !== 'undefined') {
    global.CONFIG = window.CONFIG;
  }
}

// Constantes globales adicionales
window.CONSTANTES = {
  // Factores matemáticos
  PI2: Math.PI * 2,
  PI_HALF: Math.PI / 2,
  PI_QUARTER: Math.PI / 4,
  
  // Límites de controles
  LIMITES: {
    segmentos: { min: 3, max: 15 },
    distancia: { min: 15, max: 40 },
    tamaño: { min: 5, max: 80 },
    velocidad: { min: 0.5, max: 6 },
    tiempo: { min: 0.005, max: 0.05 },
    ondulacion: { min: 0, max: 30 },
    respiracion: { min: 0, max: 0.5 },
    deformacion: { min: 0, max: 0.5 },
    tentaculos: { min: 2, max: 8 },
    longitud: { min: 15, max: 60 },
    amplitud: { min: 0.1, max: 1 },
    reaccion: { min: 50, max: 200 },
    escape: { min: 0.5, max: 5 },
    color: { min: 0, max: 255 }
  }
};

// Verificación de carga
console.log("CONFIG definido:", typeof window.CONFIG !== 'undefined');
console.log("CONSTANTES definido:", typeof window.CONSTANTES !== 'undefined');