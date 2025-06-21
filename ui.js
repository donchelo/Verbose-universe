// ===============================
// UI.JS - INTERFAZ DE USUARIO
// ===============================

// Verificar carga
if (typeof window !== 'undefined') {
  console.log("✓ ui.js cargado");
}

// === NUEVO PANEL HTML ===
let panelDiv;

// Administrador de la interfaz de usuario
window.UIManager = {
  
  // Variables de estado
  controles: {},
  botones: {},
  panelVisible: true,
  
  // ===== INICIALIZACIÓN =====
  
  init: function() {
    if (!window.CONFIG) {
      console.error("CONFIG no está disponible en UIManager.init");
      return;
    }
    // Crear panel HTML real solo una vez
    if (!panelDiv) {
      panelDiv = createDiv();
      panelDiv.class('p5ControlPanel');
      panelDiv.style('position', 'absolute');
      panelDiv.style('top', '24px');
      panelDiv.style('left', '24px');
      panelDiv.style('z-index', '10');
      panelDiv.style('background', 'rgba(255,255,255,0.97)');
      panelDiv.style('border', '1px solid #ddd');
      panelDiv.style('border-radius', '6px');
      panelDiv.style('padding', '16px 12px 12px 12px');
      panelDiv.style('box-shadow', '0 2px 8px rgba(0,0,0,0.04)');
      panelDiv.style('min-width', '260px');
      panelDiv.style('max-width', '340px');
      panelDiv.style('max-height', '90vh');
      panelDiv.style('overflow-y', 'auto');
      panelDiv.id('p5-panel');
    } else {
      panelDiv.html(''); // Limpiar si ya existe
    }
    // Título y botón cerrar
    let header = createDiv();
    header.parent(panelDiv);
    header.style('display', 'flex');
    header.style('align-items', 'center');
    header.style('justify-content', 'space-between');
    header.style('margin-bottom', '10px');
    let titulo = createSpan('CONTROLS');
    titulo.style('font-weight', 'bold');
    titulo.style('font-size', '16px');
    titulo.parent(header);
    let cerrar = createButton('×');
    cerrar.parent(header);
    cerrar.style('font-size', '16px');
    cerrar.style('background', 'none');
    cerrar.style('border', 'none');
    cerrar.style('color', '#444');
    cerrar.style('cursor', 'pointer');
    cerrar.mousePressed(() => {
      panelDiv.hide();
      this.panelVisible = false;
      window.CONFIG.ui.panel.visible = false;
    });
    this.panelVisible = window.CONFIG.ui.panel.visible;
    this.crearControles();
    this.crearBotones();
    this.aplicarEstilosCSS();
    panelDiv.show();
    console.log("✓ UI inicializada");
  },
  
  // ===== CREACIÓN DE CONTROLES =====
  
  crearControles: function() {
    if (!window.CONFIG || !window.CONSTANTES) {
      console.error("CONFIG o CONSTANTES no están disponibles para crear controles");
      return;
    }
    // Limpiar panel antes de agregar controles
    panelDiv.html(panelDiv.elt.innerHTML.split('<div')[0]);

    // === ESTRUCTURA ===
    let estructuraLabel = createDiv('Estructura');
    estructuraLabel.parent(panelDiv);
    estructuraLabel.style('font-weight', 'bold');
    estructuraLabel.style('margin', '10px 0 4px 0');
    estructuraLabel.style('font-size', '13px');
    this.controles.numeroSegmentos = this.crearSlider(0, 0, 120, 12, 3, 15, window.CONFIG.criatura.numeroSegmentos, "Número de partes");
    this.controles.distanciaSegmentos = this.crearSlider(0, 0, 120, 12, 15, 40, window.CONFIG.criatura.distanciaSegmentos, "Distancia entre partes");
    this.controles.tamañoGrande = this.crearSlider(0, 0, 120, 12, 20, 80, window.CONFIG.criatura.tamaños.grande, "Tamaño grande");
    this.controles.tamañoMedio = this.crearSlider(0, 0, 120, 12, 15, 50, window.CONFIG.criatura.tamaños.medio, "Tamaño medio");
    this.controles.tamañoPequeño = this.crearSlider(0, 0, 120, 12, 5, 25, window.CONFIG.criatura.tamaños.pequeño, "Tamaño pequeño");

    // === TENTÁCULOS ===
    let tentaculosLabel = createDiv('Tentáculos');
    tentaculosLabel.parent(panelDiv);
    tentaculosLabel.style('font-weight', 'bold');
    tentaculosLabel.style('margin', '10px 0 4px 0');
    tentaculosLabel.style('font-size', '13px');
    this.controles.numeroTentaculos = this.crearSlider(0, 0, 120, 12, 2, 8, window.CONFIG.criatura.cabeza.numeroTentaculos, "Número de tentáculos");
    this.controles.longitudTentaculos = this.crearSlider(0, 0, 120, 12, 15, 60, window.CONFIG.criatura.cabeza.longitudTentaculos, "Longitud tentáculos");
    this.controles.amplitudMovTent = this.crearSlider(0, 0, 120, 12, 0.1, 1, window.CONFIG.criatura.cabeza.amplitudMovimiento, "Movimiento tentáculos");

    // === MOVIMIENTO ===
    let movLabel = createDiv('Movimiento');
    movLabel.parent(panelDiv);
    movLabel.style('font-weight', 'bold');
    movLabel.style('margin', '10px 0 4px 0');
    movLabel.style('font-size', '13px');
    this.controles.velocidadMovimiento = this.crearSlider(0, 0, 120, 12, 0.5, 6, window.CONFIG.criatura.velocidadMovimiento, "Velocidad de movimiento");
    this.controles.amplitudOndulacion = this.crearSlider(0, 0, 120, 12, 0, 30, window.CONFIG.criatura.amplitudOndulacion, "Ondulación corporal");
    this.controles.amplitudRespiracion = this.crearSlider(0, 0, 120, 12, 0, 0.5, window.CONFIG.criatura.amplitudRespiracion, "Respiración/expansión");

    // === APARIENCIA ===
    let aparLabel = createDiv('Apariencia');
    aparLabel.parent(panelDiv);
    aparLabel.style('font-weight', 'bold');
    aparLabel.style('margin', '10px 0 4px 0');
    aparLabel.style('font-size', '13px');
    this.controles.colorR = this.crearSlider(0, 0, 120, 12, 0, 255, window.CONFIG.criatura.color[0], "Color Rojo");
    this.controles.colorG = this.crearSlider(0, 0, 120, 12, 0, 255, window.CONFIG.criatura.color[1], "Color Verde");
    this.controles.colorB = this.crearSlider(0, 0, 120, 12, 0, 255, window.CONFIG.criatura.color[2], "Color Azul");
    this.controles.grosorContorno = this.crearSlider(0, 0, 120, 12, 1, 8, window.CONFIG.criatura.grosorContorno, "Grosor de contorno");
  },
  
  crearSlider: function(x, y, w, h, min, max, val, label) {
    // Crear contenedor para el slider y la etiqueta
    let container = createDiv();
    container.parent(panelDiv);
    container.style('display', 'flex');
    container.style('flex-direction', 'row');
    container.style('align-items', 'center');
    container.style('justify-content', 'space-between');
    container.style('width', '100%');
    container.style('margin-bottom', '14px');
    // Crear etiqueta
    let etiqueta = createSpan(label + ':');
    etiqueta.style('font-size', '12px');
    etiqueta.style('color', '#444');
    etiqueta.style('flex', '1 1 80px');
    etiqueta.style('text-align', 'left');
    etiqueta.parent(container);
    // Crear slider
    let slider = createSlider(min, max, val, 0.1);
    slider.parent(container);
    slider.size(90, h);
    slider.style('flex', '2 1 90px');
    slider.style('margin', '0 8px');
    slider.style('padding', '0');
    slider.attribute('data-label', label);
    // Crear valor visual
    let valorSpan = createSpan(slider.value());
    valorSpan.style('font-size', '12px');
    valorSpan.style('color', '#222');
    valorSpan.style('flex', '0 0 38px');
    valorSpan.style('text-align', 'right');
    valorSpan.parent(container);
    // Actualizar valor visual y CONFIG en tiempo real
    slider.input(() => {
      valorSpan.html(slider.value());
      window.UIManager.actualizarConfiguracion();
    });
    return slider;
  },
  
  // ===== CREACIÓN DE BOTONES =====
  
  crearBotones: function() {
    if (!window.CONFIG) {
      console.error("CONFIG no está disponible para crear botones");
      return;
    }
    
    let controlConfig = window.CONFIG.ui.controles;
    
    // Botón toggle panel
    this.botones.toggle = createButton('×');
    this.botones.toggle.parent(panelDiv);
    this.botones.toggle.style('font-size', '16px');
    this.botones.toggle.style('background', 'none');
    this.botones.toggle.style('border', 'none');
    this.botones.toggle.style('color', '#444');
    this.botones.toggle.style('cursor', 'pointer');
    this.botones.toggle.mousePressed(() => this.togglePanel());
    
    // Botón Random destacado
    let randomBtn = createButton('Random');
    randomBtn.parent(panelDiv);
    randomBtn.style('width', '100%');
    randomBtn.style('margin', '16px 0 8px 0');
    randomBtn.style('font-size', '15px');
    randomBtn.style('font-weight', 'bold');
    randomBtn.style('background', '#222');
    randomBtn.style('color', '#fff');
    randomBtn.style('border', 'none');
    randomBtn.style('border-radius', '4px');
    randomBtn.style('padding', '8px 0');
    randomBtn.mousePressed(() => this.randomizarTodo());
  },
  
  estilizarBoton: function(boton) {
    boton.style('background', '#fff');
    boton.style('border', '1px solid #ddd');
    boton.style('border-radius', '2px');
    boton.style('font-size', '10px');
    boton.style('color', '#333');
    boton.style('cursor', 'pointer');
    boton.style('padding', '0');
    boton.style('margin', '0');
  },
  
  // ===== APLICAR ESTILOS CSS =====
  
  aplicarEstilosCSS: function() {
    let style = createElement('style');
    style.html(`
      .p5Canvas {
        max-width: 100vw !important;
      }
      .p5ControlPanel {
        min-width: 260px !important;
        max-width: 98vw !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
      }
      input[type="range"] {
        -webkit-appearance: none !important;
        appearance: none !important;
        background: transparent !important;
        cursor: pointer !important;
        width: 100% !important;
        min-width: 60px !important;
        max-width: 140px !important;
      }
      input[type="range"]::-webkit-slider-track {
        background: #f5f5f5 !important;
        height: 2px !important;
        border-radius: 1px !important;
        border: 1px solid #e0e0e0 !important;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        appearance: none !important;
        height: 10px !important;
        width: 10px !important;
        border-radius: 50% !important;
        background: #333 !important;
        border: 1px solid #999 !important;
        cursor: pointer !important;
      }
      input[type="range"]::-webkit-slider-thumb:hover {
        background: #000 !important;
      }
      input[type="range"]::-moz-range-track {
        background: #f5f5f5 !important;
        height: 2px !important;
        border-radius: 1px !important;
        border: 1px solid #e0e0e0 !important;
      }
      input[type="range"]::-moz-range-thumb {
        height: 10px !important;
        width: 10px !important;
        border-radius: 50% !important;
        background: #333 !important;
        border: 1px solid #999 !important;
        cursor: pointer !important;
        -moz-appearance: none !important;
      }
    `);
    style.parent(document.head);
  },
  
  // ===== ACTUALIZACIÓN =====
  
  actualizarConfiguracion: function() {
    if (!this.controles.numeroSegmentos || !window.CONFIG) return;
    
    // Actualizar configuración desde los controles
    window.CONFIG.criatura.numeroSegmentos = this.controles.numeroSegmentos.value();
    window.CONFIG.criatura.distanciaSegmentos = this.controles.distanciaSegmentos.value();
    window.CONFIG.criatura.tamaños.grande = this.controles.tamañoGrande.value();
    window.CONFIG.criatura.tamaños.medio = this.controles.tamañoMedio.value();
    window.CONFIG.criatura.tamaños.pequeño = this.controles.tamañoPequeño.value();
    window.CONFIG.criatura.velocidadMovimiento = this.controles.velocidadMovimiento.value();
    window.CONFIG.criatura.velocidadOndulacion = this.controles.amplitudOndulacion.value();
    window.CONFIG.criatura.velocidadRespiracion = this.controles.amplitudRespiracion.value();
    window.CONFIG.criatura.amplitudDeformacion[0] = this.controles.grosorContorno.value();
    window.CONFIG.criatura.cabeza.numeroTentaculos = this.controles.numeroTentaculos.value();
    window.CONFIG.criatura.cabeza.longitudTentaculos = this.controles.longitudTentaculos.value();
    window.CONFIG.criatura.cabeza.amplitudMovimiento = this.controles.amplitudMovTent.value();
    window.CONFIG.criatura.color[0] = this.controles.colorR.value();
    window.CONFIG.criatura.color[1] = this.controles.colorG.value();
    window.CONFIG.criatura.color[2] = this.controles.colorB.value();
  },
  
  // ===== DIBUJO =====
  
  dibujar: function() {
    if (this.panelVisible) {
      this.dibujarPanel();
    }
    this.dibujarInfo();
  },
  
  dibujarPanel: function() {
    if (!window.CONFIG) return;
    
    // Fondo del panel
    fill(...window.CONFIG.ui.colores.fondo);
    stroke(...window.CONFIG.ui.colores.borde);
    strokeWeight(1);
    rect(window.CONFIG.ui.panel.x, window.CONFIG.ui.panel.y, window.CONFIG.ui.panel.width, window.CONFIG.ui.panel.height, 3);
    
    // Título
    fill(...window.CONFIG.ui.colores.texto);
    noStroke();
    textAlign(LEFT);
    textSize(11);
    textStyle(BOLD);
    text("CONTROLS", window.CONFIG.ui.panel.x + 8, window.CONFIG.ui.panel.y + 18);
    
    // Etiquetas de secciones
    textSize(9);
    textStyle(NORMAL);
    fill(...window.CONFIG.ui.colores.textoSecundario);
    
    let yPos = window.CONFIG.ui.panel.y + 42;
    text("Structure", window.CONFIG.ui.panel.x + 135, yPos);
    text("Motion", window.CONFIG.ui.panel.x + 135, yPos + 108);
    text("Breath", window.CONFIG.ui.panel.x + 135, yPos + 148);
    text("Deform", window.CONFIG.ui.panel.x + 135, yPos + 188);
    text("Tentacles", window.CONFIG.ui.panel.x + 135, yPos + 228);
    text("Interact", window.CONFIG.ui.panel.x + 135, yPos + 268);
    text("Color", window.CONFIG.ui.panel.x + 135, yPos + 308);
  },
  
  dibujarInfo: function() {
    if (!window.CONFIG) return;
    
    // Información en tiempo real
    fill(...window.CONFIG.ui.colores.info);
    noStroke();
    textAlign(LEFT);
    textSize(9);
    
    let infoX = width - 120;
    let infoY = 20;
    
    text(`FPS: ${frameRate().toFixed(0)}`, infoX, infoY);
    text(`Segments: ${window.CONFIG.criatura.numeroSegmentos}`, infoX, infoY + 15);
    
    // Información de la criatura si existe
    if (window.creature) {
      let info = window.creature.getInfo();
      text(`X: ${info.position.x.toFixed(0)} Y: ${info.position.y.toFixed(0)}`, infoX, infoY + 30);
    }
    
    // Instrucciones
    textAlign(RIGHT);
    textSize(8);
    fill(150);
    text("SPACE: pause | R: reset | P: panel", width - 10, height - 10);
  },
  
  // ===== FUNCIONES DE CONTROL =====
  
  togglePanel: function() {
    this.panelVisible = !this.panelVisible;
    if (window.CONFIG) {
      window.CONFIG.ui.panel.visible = this.panelVisible;
    }
    if (this.panelVisible) {
      panelDiv.show();
    } else {
      panelDiv.hide();
    }
    if (this.botones.toggle) {
      this.botones.toggle.html(this.panelVisible ? '×' : '○');
    }
    this.toggleControles();
    console.log("Panel toggle:", this.panelVisible);
  },
  
  toggleControles: function() {
    // Ya no es necesario ocultar individualmente, el panel se oculta completo
  },
  
  reset: function() {
    if (window.creature) {
      window.creature.reset();
    }
    console.log("UI reset ejecutado");
  },
  
  randomizarTodo: function() {
    // Estructura
    this.controles.numeroSegmentos.value(floor(window.Utils.random(3, 16)));
    this.controles.distanciaSegmentos.value(window.Utils.random(15, 40));
    this.controles.tamañoGrande.value(window.Utils.random(20, 80));
    this.controles.tamañoMedio.value(window.Utils.random(15, 50));
    this.controles.tamañoPequeño.value(window.Utils.random(5, 25));
    // Tentáculos
    this.controles.numeroTentaculos.value(floor(window.Utils.random(2, 9)));
    this.controles.longitudTentaculos.value(window.Utils.random(15, 60));
    this.controles.amplitudMovTent.value(window.Utils.random(0.1, 1));
    // Movimiento
    this.controles.velocidadMovimiento.value(window.Utils.random(0.5, 6));
    this.controles.amplitudOndulacion.value(window.Utils.random(0, 30));
    this.controles.amplitudRespiracion.value(window.Utils.random(0, 0.5));
    // Apariencia
    this.controles.colorR.value(window.Utils.random(0, 255));
    this.controles.colorG.value(window.Utils.random(0, 255));
    this.controles.colorB.value(window.Utils.random(0, 255));
    this.controles.grosorContorno.value(window.Utils.random(1, 8));
    // Actualizar config
    this.actualizarConfiguracion();
  },
  
  // ===== APLICAR PRESET =====
  
  aplicarValores: function(valores) {
    for (let param in valores) {
      if (this.controles[param]) {
        this.controles[param].value(valores[param]);
      }
    }
    console.log("Valores aplicados desde preset");
  }
};