// ===============================
// SKETCH.JS - ARCHIVO PRINCIPAL
// ===============================

// Variables globales principales (declarar solo una vez)
let criatura; // Cambié el nombre para evitar conflictos
let isPaused = false;

// ===== FUNCIÓN PRINCIPAL DE CONFIGURACIÓN =====
function setup() {
  // Verificar que todos los módulos estén cargados
  if (typeof window.CONFIG === 'undefined') {
    console.error("CONFIG no está definido. Asegúrate de que config.js se carga primero.");
    return;
  }
  
  if (typeof window.Utils === 'undefined') {
    console.error("Utils no está definido. Asegúrate de que utils.js se carga antes que sketch.js.");
    return;
  }
  
  if (typeof window.UIManager === 'undefined') {
    console.error("UIManager no está definido. Asegúrate de que ui.js se carga antes que sketch.js.");
    return;
  }
  
  if (typeof CreatureManager === 'undefined') {
    console.error("CreatureManager no está definido. Asegúrate de que creature.js se carga antes que sketch.js.");
    return;
  }
  
  // Crear canvas
  createCanvas(window.CONFIG.canvas.width, window.CONFIG.canvas.height);
  
  // Inicializar módulos en orden
  try {
    console.log("Inicializando módulos...");
    
    // 1. Inicializar interfaz de usuario
    window.UIManager.init();
    console.log("✓ UIManager inicializado");
    
    // 2. Crear y configurar criatura
    criatura = new CreatureManager();
    console.log("✓ CreatureManager inicializado");
    
    // 3. Hacer criatura accesible globalmente para UI
    window.creature = criatura;
    
    console.log("✓ Setup completado correctamente");
    
  } catch (error) {
    console.error("Error en setup:", error);
    console.error("Stack trace:", error.stack);
    
    // Crear un canvas básico para mostrar el error
    background(255, 100, 100);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Error en inicialización", width/2, height/2);
    text("Ver consola para detalles", width/2, height/2 + 30);
  }
}

// ===== FUNCIÓN PRINCIPAL DE DIBUJO =====
function draw() {
  try {
    // Verificar que todo esté inicializado
    if (typeof window.CONFIG === 'undefined' || !criatura || typeof window.UIManager === 'undefined') {
      background(255, 200, 200);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(16);
      text("Módulos no inicializados correctamente", width/2, height/2);
      text("Revisar consola para errores", width/2, height/2 + 25);
      return;
    }
    
    // Fondo
    background(...window.CONFIG.canvas.backgroundColor);
    
    // Actualizar configuración desde UI
    window.UIManager.actualizarConfiguracion();
    
    // Actualizar y dibujar criatura (solo si no está pausado)
    if (!isPaused) {
      criatura.update();
    }
    criatura.render();
    
    // Dibujar interfaz de usuario
    window.UIManager.dibujar();
    
  } catch (error) {
    console.error("Error en draw:", error);
    console.error("Stack trace:", error.stack);
    
    // Pausar automáticamente si hay errores y mostrar error en pantalla
    isPaused = true;
    background(255, 150, 150);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Error en draw - Ver consola", width/2, height/2);
    text("Presiona R para reiniciar", width/2, height/2 + 25);
  }
}

// ===== EVENTOS DEL RATÓN =====
function mouseMoved() {
  try {
    if (criatura && !isPaused) {
      criatura.reaccionarAlMouse(mouseX, mouseY);
    }
  } catch (error) {
    console.error("Error en mouseMoved:", error);
  }
}

function mouseDragged() {
  try {
    if (criatura && !isPaused) {
      criatura.reaccionarAlMouse(mouseX, mouseY);
    }
  } catch (error) {
    console.error("Error en mouseDragged:", error);
  }
}

function mousePressed() {
  try {
    // Log de posición para debugging
    console.log("Mouse pressed:", { x: mouseX, y: mouseY });
  } catch (error) {
    console.error("Error en mousePressed:", error);
  }
}

// ===== EVENTOS DEL TECLADO =====
function keyPressed() {
  try {
    // Pausa/resume con barra espaciadora
    if (key === ' ') {
      togglePause();
    }
    
    // Reset con tecla 'r'
    if (key === 'r' || key === 'R') {
      resetEverything();
    }
    
    // Toggle panel con tecla 'p'
    if (key === 'p' || key === 'P') {
      if (window.UIManager) {
        window.UIManager.togglePanel();
      }
    }
    
    // Presets con teclas numéricas
    if (key >= '1' && key <= '5') {
      const presets = ['minimalista', 'exuberante', 'rapido', 'elegante', 'organico'];
      const index = parseInt(key) - 1;
      if (presets[index] && window.Presets) {
        window.Presets.aplicar(presets[index]);
        console.log("Preset aplicado con tecla:", presets[index]);
      }
    }
    
    // Generar aleatorio con tecla 'a'
    if (key === 'a' || key === 'A') {
      if (window.UIManager) {
        window.UIManager.generarAleatorio();
      }
    }
    
    // Debug info con tecla 'd'
    if (key === 'd' || key === 'D') {
      mostrarDebugInfo();
    }
    
  } catch (error) {
    console.error("Error en keyPressed:", error);
  }
  
  // Prevenir comportamiento por defecto del navegador
  return false;
}

// ===== FUNCIONES DE CONTROL =====
function togglePause() {
  isPaused = !isPaused;
  
  if (isPaused) {
    noLoop();
    console.log("Animación pausada");
  } else {
    loop();
    console.log("Animación reanudada");
  }
}

function resetEverything() {
  try {
    // Reset criatura
    if (criatura) {
      criatura.reset();
    }
    
    // Reanudar si estaba pausado
    if (isPaused) {
      togglePause();
    }
    
    console.log("Reset completo ejecutado");
    
  } catch (error) {
    console.error("Error en reset:", error);
  }
}

// ===== FUNCIONES DE DEBUG =====
function mostrarDebugInfo() {
  console.log("=== DEBUG INFO ===");
  
  // Información del canvas
  console.log("Canvas:", { width, height, frameRate: frameRate().toFixed(1) });
  
  // Información de la criatura
  if (criatura) {
    console.log("Criatura:", criatura.getInfo());
  }
  
  // Información de configuración
  if (window.CONFIG) {
    console.log("Config criatura:", {
      segmentos: window.CONFIG.criatura.numeroSegmentos,
      velocidad: window.CONFIG.criatura.velocidadMovimiento,
      ondulacion: window.CONFIG.criatura.amplitudOndulacion
    });
  }
  
  // Información de UI
  if (window.UIManager) {
    console.log("UI:", {
      panelVisible: window.UIManager.panelVisible,
      controlesCount: Object.keys(window.UIManager.controles || {}).length
    });
  }
  
  // Presets disponibles
  if (window.Presets) {
    console.log("Presets:", window.Presets.listar());
  }
}

// ===== GESTIÓN DE ERRORES =====
window.addEventListener('error', function(event) {
  console.error("Error global capturado:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
  
  // Pausar animación en caso de error crítico
  if (typeof isPaused !== 'undefined' && !isPaused) {
    togglePause();
  }
});

// ===== FUNCIONES DE UTILIDAD GLOBAL =====

// Función para redimensionar canvas (si se necesita)
function windowResized() {
  try {
    // Solo redimensionar si el canvas debe ser responsive
    // resizeCanvas(windowWidth, windowHeight);
    console.log("Window resized:", { width: windowWidth, height: windowHeight });
  } catch (error) {
    console.error("Error en windowResized:", error);
  }
}

// Función para limpiar recursos al cerrar
function beforeUnload() {
  try {
    console.log("Limpiando recursos antes de cerrar");
    
    // Pausar animaciones
    isPaused = true;
    noLoop();
    
    // Limpiar eventos si es necesario
    // ... código de limpieza
    
  } catch (error) {
    console.error("Error en beforeUnload:", error);
  }
}

// Añadir listener para limpieza
window.addEventListener('beforeunload', beforeUnload);

// ===== INFORMACIÓN DE CARGA =====
console.log("=== INSECTO INVERTEBRADO MODULAR ===");
console.log("Archivos cargados en orden:");
console.log("1. config.js - Configuraciones");
console.log("2. utils.js - Funciones auxiliares");
console.log("3. creature.js - Lógica de la criatura");
console.log("4. ui.js - Interfaz de usuario");
console.log("5. presets.js - Configuraciones predefinidas");
console.log("6. sketch.js - Archivo principal");
console.log("");
console.log("CONTROLES:");
console.log("- ESPACIO: Pausar/Reanudar");
console.log("- R: Reset");
console.log("- P: Toggle panel");
console.log("- 1-5: Aplicar presets");
console.log("- A: Generar aleatorio");
console.log("- D: Mostrar debug info");
console.log("- Mouse: La criatura huye del cursor");
console.log("=====================================");

/*
=== INSTRUCCIONES DE USO ===

ARCHIVOS REQUERIDOS (en este orden):
1. config.js
2. utils.js  
3. creature.js
4. ui.js
5. presets.js
6. sketch.js

ESTRUCTURA MODULAR:
- window.CONFIG: Configuraciones centralizadas
- window.Utils: Funciones auxiliares matemáticas y de utilidad
- CreatureManager: Clase para manejar la criatura
- window.UIManager: Objeto para manejar la interfaz
- window.Presets: Configuraciones predefinidas
- sketch.js: Funciones principales de P5.js

CAMBIOS PRINCIPALES:
- Variable criatura en lugar de creature para evitar conflictos
- Todas las referencias usan window.OBJETO para mayor compatibilidad
- Verificaciones de existencia antes de usar objetos
- Manejo de errores mejorado

BENEFICIOS:
- Código organizado y mantenible
- Fácil debugging por módulos
- Reutilización de componentes
- Escalabilidad para nuevas funciones
- Separación clara de responsabilidades

DEBUGGING:
- Todos los módulos tienen logging
- Manejo de errores centralizado
- Función de debug info (tecla D)
- Console logs informativos

PERSONALIZACIÓN:
- Modifica window.CONFIG para cambios globales
- Añade nuevos presets en presets.js
- Extiende window.Utils para nuevas funciones
- CreatureManager es completamente modular
*/