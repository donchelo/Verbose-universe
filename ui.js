// ===============================
// UI.JS - INTERFAZ DE USUARIO
// ===============================

// Verificar carga
if (typeof window !== 'undefined') {
  console.log("✓ ui.js cargado");
}

// === NUEVO PANEL HTML ===
let panelDiv;
let botonFlotante;
let controlesContainer; // NUEVO: Contenedor solo para los controles que se actualizan

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
    
    // Crear panel principal (solo una vez)
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
      panelDiv.style('padding', '12px');
      panelDiv.style('box-shadow', '0 2px 8px rgba(0,0,0,0.04)');
      panelDiv.style('min-width', '260px');
      panelDiv.style('max-width', '340px');
      panelDiv.style('max-height', '90vh');
      panelDiv.style('display', 'flex');
      panelDiv.style('flex-direction', 'column');
      panelDiv.id('p5-panel');
    } else {
      panelDiv.html(''); // Limpiar si ya existe para reinicio
    }

    // --- Header Fijo ---
    let header = createDiv();
    header.parent(panelDiv);
    header.style('display', 'flex');
    header.style('align-items', 'center');
    header.style('justify-content', 'space-between');
    header.style('margin-bottom', '10px');
    header.style('padding-bottom', '5px');
    header.style('border-bottom', '1px solid #eee');
    
    let titulo = createSpan('CONTROLS');
    titulo.style('font-weight', 'bold');
    titulo.style('font-size', '16px');
    titulo.parent(header);
    
    let minimizar = createButton('_');
    minimizar.parent(header);
    minimizar.style('font-size', '16px');
    minimizar.style('font-weight', 'bold');
    minimizar.style('line-height', '10px');
    minimizar.style('background', 'none');
    minimizar.style('border', 'none');
    minimizar.style('color', '#444');
    minimizar.style('cursor', 'pointer');
    minimizar.mousePressed(() => this.togglePanel());

    // --- Contenedor para Controles ---
    controlesContainer = createDiv();
    controlesContainer.parent(panelDiv);
    controlesContainer.id('controles-container');
    controlesContainer.style('overflow-y', 'auto');
    controlesContainer.style('padding-right', '5px'); // Para que la scrollbar no tape contenido

    // --- Crear el botón flotante para restaurar (solo una vez) ---
    if (!botonFlotante) {
      botonFlotante = createButton('');
      botonFlotante.html('&#9633;'); // Carácter de cuadrado para restaurar
      botonFlotante.id('boton-flotante-panel');
      botonFlotante.style('position', 'fixed');
      botonFlotante.style('top', '20px');
      botonFlotante.style('left', '20px');
      botonFlotante.style('z-index', '9999');
      botonFlotante.style('font-size', '18px');
      botonFlotante.style('line-height', '20px');
      botonFlotante.style('color', '#333');
      botonFlotante.style('background', '#fff');
      botonFlotante.style('border', '1px solid #bbb');
      botonFlotante.style('border-radius', '5px');
      botonFlotante.style('width', '38px');
      botonFlotante.style('height', '38px');
      botonFlotante.style('box-shadow', '0 2px 8px rgba(0,0,0,0.08)');
      botonFlotante.style('cursor', 'pointer');
      botonFlotante.mousePressed(() => this.togglePanel());
      document.body.appendChild(botonFlotante.elt);
    }
    
    // Crear contenido del panel
    this.panelVisible = window.CONFIG.ui.panel.visible;
    this.crearControles();
    this.crearBotones();
    this.aplicarEstilosCSS();
    
    // Sincronizar estado inicial
    this.setPanelVisible(this.panelVisible);
    
    console.log("✓ UI inicializada desde cero");
  },
  
  // ===== CREACIÓN DE CONTROLES =====
  
  crearControles: function() {
    if (!window.CONFIG || !window.CONSTANTES) {
      console.error("CONFIG o CONSTANTES no están disponibles para crear controles");
      return;
    }
    // Limpiar SOLO el contenedor de controles. El header no se toca.
    controlesContainer.html('');

    // === ESTRUCTURA ===
    let estructuraLabel = createDiv('Estructura');
    estructuraLabel.parent(controlesContainer);
    estructuraLabel.style('font-weight', 'bold');
    estructuraLabel.style('margin', '10px 0 4px 0');
    estructuraLabel.style('font-size', '13px');
    this.controles.numeroSegmentos = this.crearSlider(0, 0, 120, 12, 3, 15, window.CONFIG.criatura.numeroSegmentos, "Número de partes");
    this.controles.distanciaSegmentos = this.crearSlider(0, 0, 120, 12, 15, 40, window.CONFIG.criatura.distanciaSegmentos, "Distancia entre partes");
    this.controles.tamañoGrande = this.crearSlider(0, 0, 120, 12, 20, 80, window.CONFIG.criatura.tamaños.grande, "Tamaño grande");
    this.controles.tamañoMedio = this.crearSlider(0, 0, 120, 12, 15, 50, window.CONFIG.criatura.tamaños.medio, "Tamaño medio");
    this.controles.tamañoPequeño = this.crearSlider(0, 0, 120, 12, 5, 25, window.CONFIG.criatura.tamaños.pequeño, "Tamaño pequeño");
    this.controles.escalaGlobal = this.crearSlider(0, 0, 120, 12, 0.5, 3, window.CONFIG.criatura.escalaGlobal, "Escala general");

    // === TENTÁCULOS ===
    let tentaculosLabel = createDiv('Tentáculos');
    tentaculosLabel.parent(controlesContainer);
    tentaculosLabel.style('font-weight', 'bold');
    tentaculosLabel.style('margin', '10px 0 4px 0');
    tentaculosLabel.style('font-size', '13px');
    this.controles.numeroTentaculos = this.crearSlider(0, 0, 120, 12, 2, 8, window.CONFIG.criatura.cabeza.numeroTentaculos, "Número de tentáculos");
    this.controles.longitudTentaculos = this.crearSlider(0, 0, 120, 12, 15, 60, window.CONFIG.criatura.cabeza.longitudTentaculos, "Longitud tentáculos");
    this.controles.grosorTentaculos = this.crearSlider(0, 0, 120, 12, 1, 10, window.CONFIG.criatura.cabeza.grosorTentaculos, "Grosor tentáculos");
    this.controles.tamañoPuntas = this.crearSlider(0, 0, 120, 12, 2, 20, window.CONFIG.criatura.cabeza.tamañoPuntas, "Tamaño punta tentáculo");
    this.controles.amplitudMovTent = this.crearSlider(0, 0, 120, 12, 0.1, 1, window.CONFIG.criatura.cabeza.amplitudMovimiento, "Movimiento tentáculos");

    // === MOVIMIENTO ===
    let movLabel = createDiv('Movimiento');
    movLabel.parent(controlesContainer);
    movLabel.style('font-weight', 'bold');
    movLabel.style('margin', '10px 0 4px 0');
    movLabel.style('font-size', '13px');
    this.controles.velocidadMovimiento = this.crearSlider(0, 0, 120, 12, 0.5, 6, window.CONFIG.criatura.velocidadMovimiento, "Velocidad de movimiento");
    this.controles.amplitudOndulacion = this.crearSlider(0, 0, 120, 12, 0, 30, window.CONFIG.criatura.amplitudOndulacion, "Ondulación corporal");
    this.controles.texturaSuperficie = this.crearSlider(0, 0, 120, 12, 0, 1, window.CONFIG.criatura.texturaSuperficie, "Textura de movimiento");
    this.controles.amplitudRespiracion = this.crearSlider(0, 0, 120, 12, 0, 0.5, window.CONFIG.criatura.amplitudRespiracion, "Respiración/expansión");

    // === APARIENCIA ===
    let aparLabel = createDiv('Apariencia');
    aparLabel.parent(controlesContainer);
    aparLabel.style('font-weight', 'bold');
    aparLabel.style('margin', '10px 0 4px 0');
    aparLabel.style('font-size', '13px');
    this.crearColorPickerHSV();
    this.controles.grosorContorno = this.crearSlider(0, 0, 120, 12, 1, 8, window.CONFIG.criatura.grosorContorno, "Grosor de contorno");

    // === MODO DE MOVIMIENTO ===
    let modoLabel = createDiv('Modo de movimiento');
    modoLabel.parent(controlesContainer);
    modoLabel.style('font-weight', 'bold');
    modoLabel.style('margin', '10px 0 4px 0');
    modoLabel.style('font-size', '13px');
    let selectModo = createSelect();
    selectModo.parent(controlesContainer);
    selectModo.option('Huir del mouse', 'huir');
    selectModo.option('Acercarse al mouse', 'acercarse');
    selectModo.option('Automático', 'automatico');
    selectModo.option('Control manual (flechas)', 'manual');
    selectModo.value('manual');
    selectModo.changed(() => {
      if (window.creature) {
        window.creature.setModoMovimiento(selectModo.value());
      }
    });
    this.controles.selectModo = selectModo;

    // === PARÁMETROS AVANZADOS ===
    let avanzadosLabel = createDiv('Avanzado');
    avanzadosLabel.parent(controlesContainer);
    avanzadosLabel.style('font-weight', 'bold');
    avanzadosLabel.style('margin', '10px 0 4px 0');
    avanzadosLabel.style('font-size', '13px');
    this.controles.elasticidad = this.crearSlider(0, 0, 120, 12, 0, 1, window.CONFIG.criatura.elasticidad, "Elasticidad");
    this.controles.bioluminiscencia = this.crearSlider(0, 0, 120, 12, 0, 1, window.CONFIG.criatura.bioluminiscencia, "Bioluminiscencia");
    let patronLabel = createSpan('Patrón tentáculos:');
    patronLabel.style('font-size', '12px');
    patronLabel.style('color', '#444');
    patronLabel.parent(controlesContainer);
    let selectPatron = createSelect();
    selectPatron.parent(controlesContainer);
    selectPatron.option('Normal', 'normal');
    selectPatron.option('Doble', 'doble');
    selectPatron.option('Espiral', 'espiral');
    selectPatron.value(window.CONFIG.criatura.patronTentaculos);
    selectPatron.changed(() => window.UIManager.actualizarConfiguracion());
    this.controles.patronTentaculos = selectPatron;
  },
  
  crearSlider: function(x, y, w, h, min, max, val, label) {
    // Crear contenedor para el slider y la etiqueta
    let container = createDiv();
    container.parent(controlesContainer);
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
    // Devolver ambos para poder sincronizar visualmente
    let control = slider;
    control._valorSpan = valorSpan;
    return control;
  },
  
  // ===== CREACIÓN DE BOTONES =====
  
  crearBotones: function() {
    if (!window.CONFIG) {
      console.error("CONFIG no está disponible para crear botones");
      return;
    }
        
    // Botón Random destacado
    let randomBtn = createButton('Random');
    randomBtn.parent(controlesContainer);
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
        box-sizing: border-box !important;
      }
      #controles-container::-webkit-scrollbar {
        width: 6px;
      }
      #controles-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      #controles-container::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
      #controles-container::-webkit-scrollbar-thumb:hover {
        background: #999;
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
    window.CONFIG.criatura.amplitudOndulacion = this.controles.amplitudOndulacion.value();
    window.CONFIG.criatura.texturaSuperficie = this.controles.texturaSuperficie.value();
    window.CONFIG.criatura.velocidadRespiracion = this.controles.amplitudRespiracion.value();
    window.CONFIG.criatura.grosorContorno = this.controles.grosorContorno.value();
    window.CONFIG.criatura.cabeza.numeroTentaculos = this.controles.numeroTentaculos.value();
    window.CONFIG.criatura.cabeza.longitudTentaculos = this.controles.longitudTentaculos.value();
    window.CONFIG.criatura.cabeza.grosorTentaculos = this.controles.grosorTentaculos.value();
    window.CONFIG.criatura.cabeza.tamañoPuntas = this.controles.tamañoPuntas.value();
    window.CONFIG.criatura.cabeza.amplitudMovimiento = this.controles.amplitudMovTent.value();
    window.CONFIG.criatura.elasticidad = this.controles.elasticidad.value();
    window.CONFIG.criatura.bioluminiscencia = this.controles.bioluminiscencia.value();
    window.CONFIG.criatura.patronTentaculos = this.controles.patronTentaculos.value();
    window.CONFIG.criatura.escalaGlobal = this.controles.escalaGlobal.value();
    if (window.creature && typeof window.creature.recalcularFormasSegmentos === 'function') {
      window.creature.recalcularFormasSegmentos();
    }
  },
  
  // ===== DIBUJO =====
  
  dibujar: function() {
    // El panel HTML ahora se gestiona con show/hide, no se redibuja en p5.
    this.dibujarInfo();
  },
  
  dibujarPanel: function() {
    // Esta función ya no es necesaria, el panel es HTML y se gestiona con CSS y DOM.
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
  
  setPanelVisible: function(visible) {
    this.panelVisible = visible;
    if (window.CONFIG) {
      window.CONFIG.ui.panel.visible = this.panelVisible;
    }
    if (this.panelVisible) {
      panelDiv.show();
      if (botonFlotante) botonFlotante.hide();
    } else {
      panelDiv.hide();
      if (botonFlotante) botonFlotante.show();
    }
  },

  togglePanel: function() {
    this.setPanelVisible(!this.panelVisible);
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
    this.controles.grosorTentaculos.value(window.Utils.random(1, 10));
    this.controles.tamañoPuntas.value(window.Utils.random(2, 20));
    this.controles.amplitudMovTent.value(window.Utils.random(0.1, 1));
    // Movimiento
    this.controles.velocidadMovimiento.value(window.Utils.random(0.5, 6));
    this.controles.amplitudOndulacion.value(window.Utils.random(0, 30));
    this.controles.texturaSuperficie.value(window.Utils.random(0, 1));
    this.controles.amplitudRespiracion.value(window.Utils.random(0, 0.5));
    // Apariencia
    this.controles.grosorContorno.value(window.Utils.random(1, 8));

    // === RANDOMIZAR COLOR HSV ===
    if (window.UIManager._colorPickerHSV && typeof window.UIManager._colorPickerValue !== 'undefined') {
      // Randomizar H, S, V
      let h = Math.random();
      let s = 0.5 + Math.random() * 0.5; // saturación alta
      let v = 0.7 + Math.random() * 0.3; // brillo alto
      window.UIManager._colorPickerHSV[0] = h;
      window.UIManager._colorPickerHSV[1] = s;
      window.UIManager._colorPickerHSV[2] = v;
      window.UIManager._colorPickerValue = v;
      // Actualizar color de criatura
      let rgb = Utils.hsvToRgb(h, s, v);
      window.CONFIG.criatura.color[0] = rgb[0];
      window.CONFIG.criatura.color[1] = rgb[1];
      window.CONFIG.criatura.color[2] = rgb[2];
      // Actualizar visualmente el selector si existe
      if (window.UIManager._actualizarColorPickerVisual) {
        window.UIManager._actualizarColorPickerVisual();
      }
    }

    // Actualizar config
    this.actualizarConfiguracion();
    this.sincronizarValoresVisuales();
  },
  
  // ===== SINCRONIZAR VALORES VISUALES =====
  sincronizarValoresVisuales: function() {
    for (let key in this.controles) {
      let control = this.controles[key];
      if (control && control._valorSpan) {
        control._valorSpan.html(control.value());
      }
    }
  },
  
  // ===== APLICAR PRESET =====
  
  aplicarValores: function(valores) {
    for (let param in valores) {
      if (this.controles[param]) {
        this.controles[param].value(valores[param]);
      }
    }
    this.sincronizarValoresVisuales();
    console.log("Valores aplicados desde preset");
  },
  
  setSelectModo: function(modo) {
    if (this.controles && this.controles.selectModo) {
      this.controles.selectModo.value(modo);
    }
  },

  // --- Nuevo método para el selector de color tipo arcoíris (HSV) ---
  crearColorPickerHSV: function() {
    // Contenedor visual
    let container = createDiv();
    container.parent(controlesContainer);
    container.style('display', 'flex');
    container.style('flex-direction', 'column');
    container.style('align-items', 'center');
    container.style('margin-bottom', '14px');

    // Etiqueta
    let etiqueta = createSpan('Color:');
    etiqueta.style('font-size', '12px');
    etiqueta.style('color', '#444');
    etiqueta.style('margin-bottom', '4px');
    etiqueta.parent(container);

    // Canvas HTML puro para la rueda de color
    let size = 100;
    let colorCanvas = document.createElement('canvas');
    colorCanvas.width = size;
    colorCanvas.height = size;
    colorCanvas.style.borderRadius = '50%';
    colorCanvas.style.display = 'block';
    colorCanvas.style.background = '#fff';
    let colorDiv = createDiv();
    colorDiv.parent(container);
    colorDiv.elt.appendChild(colorCanvas);
    colorDiv.style('position', 'relative');
    colorDiv.style('width', size + 'px');
    colorDiv.style('height', size + 'px');
    colorDiv.style('margin-bottom', '6px');

    // Dibujar la rueda de color HSV en el canvas HTML
    function drawColorWheelHTML(val) {
      let ctx = colorCanvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      let radius = size / 2 - 2;
      let imageData = ctx.createImageData(size, size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let dx = x - size / 2;
          let dy = y - size / 2;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= radius) {
            let angle = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);
            let hue = angle / (Math.PI * 2);
            let sat = dist / radius;
            let rgb = Utils.hsvToRgb(hue, sat, val);
            let idx = (y * size + x) * 4;
            imageData.data[idx] = rgb[0];
            imageData.data[idx + 1] = rgb[1];
            imageData.data[idx + 2] = rgb[2];
            imageData.data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Estado del color HSV
    let hsv;
    if (!window.UIManager._colorPickerHSV) {
      // Inicializar con color random la primera vez
      let h = Math.random();
      let s = 0.5 + Math.random() * 0.5;
      let v = 0.7 + Math.random() * 0.3;
      hsv = [h, s, v];
      window.UIManager._colorPickerHSV = hsv;
      window.UIManager._colorPickerValue = v;
      let rgb = Utils.hsvToRgb(h, s, v);
      window.CONFIG.criatura.color[0] = rgb[0];
      window.CONFIG.criatura.color[1] = rgb[1];
      window.CONFIG.criatura.color[2] = rgb[2];
    } else {
      hsv = window.UIManager._colorPickerHSV;
    }
    drawColorWheelHTML(hsv[2]);

    // Indicador de selección
    let selector = createDiv();
    selector.parent(colorDiv);
    selector.style('position', 'absolute');
    selector.style('width', '14px');
    selector.style('height', '14px');
    selector.style('border', '2px solid #fff');
    selector.style('border-radius', '50%');
    selector.style('box-shadow', '0 0 2px #000');
    selector.style('pointer-events', 'none');
    
    function updateSelectorPos() {
      selector.style('left', (size/2 + hsv[1]*Math.cos(hsv[0]*2*Math.PI)*size/2 - 7) + 'px');
      selector.style('top', (size/2 + hsv[1]*Math.sin(hsv[0]*2*Math.PI)*size/2 - 7) + 'px');
    }
    updateSelectorPos();

    window.UIManager._actualizarColorPickerVisual = () => {
      hsv = window.UIManager._colorPickerHSV;
      drawColorWheelHTML(hsv[2]);
      updateSelectorPos();
    };

    // Interacción con la rueda de color
    function handleColorSelection(e) {
      let rect = colorCanvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      let dx = x - size/2;
      let dy = y - size/2;
      let dist = Math.sqrt(dx*dx + dy*dy);
      let radius = size/2 - 2;
      if (dist <= radius) {
        let angle = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);
        let hue = angle / (Math.PI * 2);
        let sat = dist / radius;
        hsv[0] = hue;
        hsv[1] = sat;
        updateSelectorPos();
        // Actualizar color
        let rgb = Utils.hsvToRgb(hue, sat, hsv[2]);
        window.CONFIG.criatura.color[0] = rgb[0];
        window.CONFIG.criatura.color[1] = rgb[1];
        window.CONFIG.criatura.color[2] = rgb[2];
        window.UIManager._colorPickerHSV = [hue, sat, hsv[2]];
      }
    }
    colorCanvas.addEventListener('mousedown', (e) => {
      handleColorSelection(e);
      document.addEventListener('mousemove', handleColorSelection);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleColorSelection);
      }, { once: true });
    });


    // Slider de brillo (valor)
    let brilloSliderContainer = createDiv();
    brilloSliderContainer.parent(container);
    brilloSliderContainer.style('display', 'flex');
    brilloSliderContainer.style('align-items', 'center');
    brilloSliderContainer.style('width', '100%');
    brilloSliderContainer.style('max-width', '160px');
    brilloSliderContainer.style('justify-content', 'space-between');
    brilloSliderContainer.style('margin-top', '8px');

    let brilloLabel = createSpan('Brillo:');
    brilloLabel.style('font-size', '11px');
    brilloLabel.style('color', '#444');
    brilloLabel.style('margin-right', '6px');
    brilloLabel.parent(brilloSliderContainer);

    let brilloSlider = createSlider(0, 1, hsv[2], 0.01);
    brilloSlider.parent(brilloSliderContainer);
    brilloSlider.style('width', '100px');
    brilloSlider.input(() => {
      let v = brilloSlider.value();
      hsv[2] = v;
      window.UIManager._colorPickerValue = v;
      drawColorWheelHTML(v);
      let rgb = Utils.hsvToRgb(hsv[0], hsv[1], v);
      window.CONFIG.criatura.color[0] = rgb[0];
      window.CONFIG.criatura.color[1] = rgb[1];
      window.CONFIG.criatura.color[2] = rgb[2];
    });
  }
};