// ===============================
// CREATURE.JS - LÓGICA DE LA CRIATURA COMPLETO
// ===============================

// Clase principal para manejar la criatura
class CreatureManager {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.tiempo = 0;
    this.segmentos = [];
    this.terciosSizes = [];
    this.ultimoNumeroSegmentos = 0;
    this.estadisticas = {
      distanciaRecorrida: 0,
      tiempoVida: 0,
      colisionesConBordes: 0,
      interaccionesConMouse: 0
    };
    this.modoMovimiento = 'manual'; // 'automatico', 'huir', 'acercarse', 'manual'
    this.direccionManual = { x: 0, y: 0 };
    
    this.init();
  }
  
  // ===== INICIALIZACIÓN =====
  
  init() {
    // Posición inicial en el centro
    this.position.x = width / 2;
    this.position.y = height / 2;
    
    // Resetear estadísticas
    this.resetEstadisticas();
    
    // Calcular tamaños y crear segmentos
    this.calcularTamañosTercios();
    this.inicializarSegmentos();
    
    Utils.log("Criatura inicializada", {
      position: this.position,
      segmentos: this.segmentos.length
    });
  }
  
  calcularTamañosTercios() {
    // Proporción áurea para tamaños de segmentos
    this.terciosSizes = [];
    const n = CONFIG.criatura.numeroSegmentos;
    const grande = CONFIG.criatura.tamaños.grande;
    const ratio = 0.618; // Proporción áurea
    let size = grande;
    for (let i = 0; i < n; i++) {
      this.terciosSizes.push(size);
      size *= ratio;
    }
  }
  
  inicializarSegmentos() {
    this.segmentos = [];
    for (let i = 0; i < CONFIG.criatura.numeroSegmentos; i++) {
      // Asignar la forma solo una vez, de manera pseudoaleatoria pero fija
      let valor = Math.abs(Math.sin(i * 1.7 + this.position.x * 0.01 + this.position.y * 0.01));
      let forma;
      if (valor < 0.33) forma = 'circulo';
      else if (valor < 0.66) forma = 'cuadrado';
      else forma = 'triangulo';
      this.segmentos.push({
        x: this.position.x - i * CONFIG.criatura.distanciaSegmentos,
        y: this.position.y,
        tamaño: this.terciosSizes[i] || CONFIG.criatura.tamaños.pequeño,
        fase: i * CONFIG.criatura.factorDesfase,
        velocidadX: 0,
        velocidadY: 0,
        anguloRotacion: 0,
        energia: 1.0,
        forma,
        elasticidad: CONFIG.criatura.elasticidad,
        bioluminiscencia: CONFIG.criatura.bioluminiscencia,
        patronTentaculos: CONFIG.criatura.patronTentaculos,
        tentaculos: Math.max(CONFIG.criatura.tentaculosBase, Math.round((this.terciosSizes[i] || CONFIG.criatura.tamaños.pequeño) * CONFIG.criatura.tentaculosFactorTamaño)),
      });
    }
  }
  
  resetEstadisticas() {
    this.estadisticas = {
      distanciaRecorrida: 0,
      tiempoVida: 0,
      colisionesConBordes: 0,
      interaccionesConMouse: 0
    };
  }
  
  // ===== ACTUALIZACIÓN =====
  
  update() {
    // Incrementar tiempo y estadísticas
    this.tiempo += CONFIG.criatura.velocidadTiempo;
    this.estadisticas.tiempoVida += CONFIG.criatura.velocidadTiempo;
    
    // Verificar si cambió el número de segmentos
    this.verificarCambioSegmentos();
    
    // Actualizar movimiento y segmentos
    const posicionAnterior = { x: this.position.x, y: this.position.y };
    this.actualizarMovimiento();
    this.actualizarSegmentos();
    
    // Calcular distancia recorrida
    const distancia = Utils.distance(
      posicionAnterior.x, posicionAnterior.y,
      this.position.x, this.position.y
    );
    this.estadisticas.distanciaRecorrida += distancia;
    
    // Actualizar energía de segmentos
    this.actualizarEnergia();
  }
  
  verificarCambioSegmentos() {
    if (CONFIG.criatura.numeroSegmentos !== this.ultimoNumeroSegmentos) {
      // Ajustar patrón de tamaños si es necesario
      while (CONFIG.criatura.patronTamaños.length < CONFIG.criatura.numeroSegmentos) {
        CONFIG.criatura.patronTamaños.push('pequeño');
      }
      
      this.calcularTamañosTercios();
      this.ajustarNumeroSegmentos();
      this.ultimoNumeroSegmentos = CONFIG.criatura.numeroSegmentos;
      
      Utils.log("Número de segmentos actualizado", CONFIG.criatura.numeroSegmentos);
    }
  }
  
  ajustarNumeroSegmentos() {
    const diferencia = CONFIG.criatura.numeroSegmentos - this.segmentos.length;
    if (diferencia > 0) {
      // Añadir segmentos
      for (let i = 0; i < diferencia; i++) {
        const ultimoSegmento = this.segmentos[this.segmentos.length - 1];
        const nuevoIndice = this.segmentos.length;
        // Asignar la forma solo una vez, de manera pseudoaleatoria pero fija
        let valor = Math.abs(Math.sin(nuevoIndice * 1.7 + ultimoSegmento.x * 0.01 + ultimoSegmento.y * 0.01));
        let forma;
        if (valor < 0.33) forma = 'circulo';
        else if (valor < 0.66) forma = 'cuadrado';
        else forma = 'triangulo';
        this.segmentos.push({
          x: ultimoSegmento.x - CONFIG.criatura.distanciaSegmentos,
          y: ultimoSegmento.y,
          tamaño: this.terciosSizes[nuevoIndice] || CONFIG.criatura.tamaños.pequeño,
          fase: nuevoIndice * CONFIG.criatura.factorDesfase,
          velocidadX: 0,
          velocidadY: 0,
          anguloRotacion: 0,
          energia: 1.0,
          forma,
          elasticidad: CONFIG.criatura.elasticidad,
          bioluminiscencia: CONFIG.criatura.bioluminiscencia,
          patronTentaculos: CONFIG.criatura.patronTentaculos,
          tentaculos: Math.max(CONFIG.criatura.tentaculosBase, Math.round((this.terciosSizes[nuevoIndice] || CONFIG.criatura.tamaños.pequeño) * CONFIG.criatura.tentaculosFactorTamaño)),
        });
      }
    } else if (diferencia < 0) {
      // Remover segmentos
      this.segmentos.splice(CONFIG.criatura.numeroSegmentos);
    }
  }
  
  actualizarMovimiento() {
    const posAnterior = { x: this.position.x, y: this.position.y };
    if (this.modoMovimiento === 'manual') {
      // Movimiento manual con flechas
      const velocidad = CONFIG.criatura.velocidadMovimiento * 1.2;
      this.position.x += this.direccionManual.x * velocidad;
      this.position.y += this.direccionManual.y * velocidad;
      this.aplicarLimites(posAnterior);
      return;
    }
    if (this.modoMovimiento === 'acercarse') {
      // Si el mouse está cerca, acercarse
      let distanciaAlMouse = dist(mouseX, mouseY, this.position.x, this.position.y);
      if (distanciaAlMouse < CONFIG.interaccion.distanciaReaccion) {
        let angulo = atan2(mouseY - this.position.y, mouseX - this.position.x);
        let factorDistancia = 1 - (distanciaAlMouse / CONFIG.interaccion.distanciaReaccion);
        let fuerza = CONFIG.interaccion.fuerzaEscape * factorDistancia;
        this.position.x += cos(angulo) * fuerza;
        this.position.y += sin(angulo) * fuerza;
      }
      // Además, movimiento orgánico
      this.movimientoOrganico();
      this.aplicarLimites(posAnterior);
      return;
    }
    if (this.modoMovimiento === 'huir') {
      // Movimiento orgánico + huir del mouse
      this.movimientoOrganico();
      // Huir del mouse si está cerca
      let distanciaAlMouse = dist(mouseX, mouseY, this.position.x, this.position.y);
      if (distanciaAlMouse < CONFIG.interaccion.distanciaReaccion) {
        let anguloEscape = atan2(this.position.y - mouseY, this.position.x - mouseX);
        let factorDistancia = 1 - (distanciaAlMouse / CONFIG.interaccion.distanciaReaccion);
        let fuerzaEscape = CONFIG.interaccion.fuerzaEscape * factorDistancia;
        this.position.x += cos(anguloEscape) * fuerzaEscape;
        this.position.y += sin(anguloEscape) * fuerzaEscape;
      }
      this.aplicarLimites(posAnterior);
      return;
    }
    // Modo automático: solo movimiento orgánico
    this.movimientoOrganico();
    this.aplicarLimites(posAnterior);
  }
  
  movimientoOrganico() {
    let direccionX = cos(this.tiempo * 0.3) * cos(this.tiempo * 0.7);
    let direccionY = sin(this.tiempo * 0.4) * sin(this.tiempo * 0.6);
    if (typeof noise !== 'undefined') {
      direccionX += (noise(this.tiempo * 0.1, 0) - 0.5) * 0.5;
      direccionY += (noise(0, this.tiempo * 0.1) - 0.5) * 0.5;
    }
    this.position.x += direccionX * CONFIG.criatura.velocidadMovimiento;
    this.position.y += direccionY * CONFIG.criatura.velocidadMovimiento * 0.75;
  }
  
  aplicarLimites(posAnterior) {
    let margenEfectivo = CONFIG.limites.margen;
    if (CONFIG.ui.panel.visible) {
      margenEfectivo = max(CONFIG.limites.margen, CONFIG.ui.panel.width + 40);
    }
    
    let colision = false;
    
    // Detectar colisiones en X
    if (this.position.x <= margenEfectivo || this.position.x >= width - CONFIG.limites.margen) {
      CONFIG.criatura.velocidadMovimiento *= -0.8; // Rebote suave
      this.tiempo += PI * 0.25; // Cambio de dirección
      colision = true;
    }
    
    // Detectar colisiones en Y
    if (this.position.y <= CONFIG.limites.margen || this.position.y >= height - CONFIG.limites.margen) {
      CONFIG.criatura.velocidadMovimiento *= -0.8; // Rebote suave
      this.tiempo += PI * 0.25; // Cambio de dirección
      colision = true;
    }
    
    // Contar colisiones
    if (colision) {
      this.estadisticas.colisionesConBordes++;
    }
    
    // Límites absolutos - nunca salir de pantalla
    this.position.x = constrain(this.position.x, margenEfectivo, width - CONFIG.limites.margen);
    this.position.y = constrain(this.position.y, CONFIG.limites.margen, height - CONFIG.limites.margen);
    
    // Asegurar que los segmentos también estén dentro
    this.constrainSegmentos();
  }
  
  constrainSegmentos() {
    for (let seg of this.segmentos) {
      if (seg) {
        seg.x = constrain(seg.x, CONFIG.limites.margen, width - CONFIG.limites.margen);
        seg.y = constrain(seg.y, CONFIG.limites.margen, height - CONFIG.limites.margen);
      }
    }
  }
  
  actualizarSegmentos() {
    // Primer segmento (cabeza) sigue la posición principal
    if (this.segmentos.length > 0) {
      this.segmentos[0].x = this.position.x;
      this.segmentos[0].y = this.position.y;
      this.segmentos[0].anguloRotacion = atan2(
        this.segmentos[1] ? this.segmentos[1].y - this.segmentos[0].y : 0,
        this.segmentos[1] ? this.segmentos[1].x - this.segmentos[0].x : 0
      );
    }
    
    // Segmentos siguientes con física mejorada
    for (let i = 1; i < min(CONFIG.criatura.numeroSegmentos, this.segmentos.length); i++) {
      this.actualizarSegmento(i);
    }
  }
  
  actualizarSegmento(i) {
    let objetivo = this.segmentos[i - 1];
    let segmentoActual = this.segmentos[i];
    
    if (!objetivo || !segmentoActual) return;
    
    // Calcular ángulo hacia el objetivo
    let anguloHaciaObjetivo = atan2(objetivo.y - segmentoActual.y, objetivo.x - segmentoActual.x);
    
    // Ondulación perpendicular con variación por segmento
    let ondulacionBase = sin(this.tiempo * CONFIG.criatura.velocidadOndulacion + segmentoActual.fase) *
      CONFIG.criatura.amplitudOndulacion;

    // Detalle de textura inspirado en arte generativo
    let k = cos(segmentoActual.x * 0.1) + sin(segmentoActual.y * 0.1 - this.tiempo);
    let textura = sin(k * 5 + this.tiempo * 2) * CONFIG.criatura.amplitudOndulacion * CONFIG.criatura.texturaSuperficie;

    let ondulacion = ondulacionBase + textura;

    let anguloOndulacion = anguloHaciaObjetivo + PI / 2;
    
    // Factor de ondulación que decrece hacia la cola
    let factorOndulacion = (i / CONFIG.criatura.numeroSegmentos);
    
    // Posición objetivo con ondulación
    let objetivoX = objetivo.x - cos(anguloHaciaObjetivo) * CONFIG.criatura.distanciaSegmentos + 
                    cos(anguloOndulacion) * ondulacion * factorOndulacion;
    let objetivoY = objetivo.y - sin(anguloHaciaObjetivo) * CONFIG.criatura.distanciaSegmentos + 
                    sin(anguloOndulacion) * ondulacion * factorOndulacion;
    
    // Calcular velocidades
    segmentoActual.velocidadX = (objetivoX - segmentoActual.x) * CONFIG.interaccion.suavidadSeguimiento;
    segmentoActual.velocidadY = (objetivoY - segmentoActual.y) * CONFIG.interaccion.suavidadSeguimiento;
    
    // Aplicar velocidades con amortiguación
    segmentoActual.x += segmentoActual.velocidadX;
    segmentoActual.y += segmentoActual.velocidadY;
    
    // Actualizar ángulo de rotación
    segmentoActual.anguloRotacion = atan2(segmentoActual.velocidadY, segmentoActual.velocidadX);
    
    // Amortiguación de velocidades
    segmentoActual.velocidadX *= 0.9;
    segmentoActual.velocidadY *= 0.9;
  }
  
  actualizarEnergia() {
    // Actualizar energía de cada segmento basada en movimiento
    for (let i = 0; i < this.segmentos.length; i++) {
      let seg = this.segmentos[i];
      if (!seg) continue;
      
      // La energía oscila con el tiempo y movimiento
      let energiaBase = 0.8 + 0.2 * sin(this.tiempo * 2 + seg.fase);
      let energiaMovimiento = min(1.0, abs(seg.velocidadX) + abs(seg.velocidadY));
      
      seg.energia = Utils.lerp(seg.energia, energiaBase + energiaMovimiento * 0.2, 0.1);
      seg.energia = constrain(seg.energia, 0.3, 1.0);
    }
  }
  
  // ===== DIBUJO =====
  
  render() {
    // Configurar estilo base
    fill(...CONFIG.criatura.color);
    stroke(...CONFIG.criatura.color);
    
    // Dibujar en orden correcto
    this.dibujarSombra();
    this.dibujarConexiones();
    this.dibujarSegmentos();
    this.dibujarCabeza();
    this.dibujarDetalles();
  }
  
  dibujarSombra() {
    // Sombra geométrica sutil
    push();
    fill(30, 30, 30, 18);
    noStroke();
    for (let i = 0; i < min(CONFIG.criatura.numeroSegmentos, this.segmentos.length); i++) {
      let seg = this.segmentos[i];
      if (!seg) continue;
      ellipse(seg.x + 4, seg.y + 6, seg.tamaño * 0.8, seg.tamaño * 0.22);
    }
    pop();
  }
  
  dibujarConexiones() {
    // Conexión minimalista: línea recta entre centros
    stroke(30, 30, 30, 80);
    strokeWeight(CONFIG.criatura.grosorConexiones);
    for (let i = 0; i < min(CONFIG.criatura.numeroSegmentos - 1, this.segmentos.length - 1); i++) {
      let seg1 = this.segmentos[i];
      let seg2 = this.segmentos[i + 1];
      if (seg1 && seg2) {
        line(seg1.x, seg1.y, seg2.x, seg2.y);
      }
    }
  }
  
  dibujarSegmentos() {
    strokeWeight(CONFIG.criatura.grosorContorno);
    stroke(30, 30, 30); // Contorno oscuro y uniforme
    for (let i = 0; i < min(CONFIG.criatura.numeroSegmentos, this.segmentos.length); i++) {
      let seg = this.segmentos[i];
      if (!seg) continue;
      let tamaño = seg.tamaño;
      fill(CONFIG.criatura.color[0], CONFIG.criatura.color[1], CONFIG.criatura.color[2], 220);
      push();
      translate(seg.x, seg.y);
      let forma = seg.forma || 'circulo';
      if (forma === 'cuadrado') {
        rectMode(CENTER);
        rect(0, 0, tamaño, tamaño);
      } else if (forma === 'triangulo') {
        let h = tamaño * Math.sqrt(3) / 2;
        beginShape();
        vertex(-tamaño/2, h/3);
        vertex(tamaño/2, h/3);
        vertex(0, -2*h/3);
        endShape(CLOSE);
      } else { // círculo por defecto
        ellipse(0, 0, tamaño, tamaño);
      }
      // Dibujar tentáculos para cada segmento
      if (CONFIG.criatura.tentaculosPorSegmento && seg.tentaculos > 0) {
        let t = (typeof this.tiempo !== 'undefined') ? this.tiempo : 0;
        let num = seg.tentaculos;
        let longitud = seg.tamaño * 0.7 + CONFIG.criatura.cabeza.longitudTentaculos * (seg.tamaño / CONFIG.criatura.tamaños.grande);
        let grosor = CONFIG.criatura.cabeza.grosorTentaculos * (seg.tamaño / CONFIG.criatura.tamaños.grande);
        let punta = CONFIG.criatura.cabeza.tamañoPuntas * (seg.tamaño / CONFIG.criatura.tamaños.grande);
        for (let j = 0; j < num; j++) {
          let anguloBase = (PI * 2 / num) * j - PI / 2;
          let desfase = 0;
          if (CONFIG.criatura.tentaculoDinamico.activo) {
            desfase = this.calcularDesfaseTentaculo(seg, j, t, i);
          } else {
            // Comportamiento anterior
            desfase = sin(t * CONFIG.criatura.cabeza.amplitudMovimiento + j + i) * 0.4;
          }

          let angulo = anguloBase + desfase;

          // Mantener los patrones pero aplicarlos sobre el nuevo desfase
          if (seg.patronTentaculos === 'doble') angulo += sin(j * 5 + t * 2) * 0.3;
          if (seg.patronTentaculos === 'espiral') angulo += (t * 0.5 + i * 0.1);

          let x2 = cos(angulo) * longitud;
          let y2 = sin(angulo) * longitud;
          // Bioluminiscencia: brillo
          let brillo = 80 + 175 * seg.bioluminiscencia;
          stroke(30, 30, 30, brillo);
          strokeWeight(grosor);
          line(0, 0, x2, y2);
          fill(200, 240, 255, 120 + 120 * seg.bioluminiscencia);
          noStroke();
          ellipse(x2, y2, punta, punta);
        }
      }
      pop();
    }
  }
  
  dibujarCabeza() {
    if (this.segmentos.length === 0) return;
    let cabeza = this.segmentos[0];
    push();
    translate(cabeza.x, cabeza.y);
    // Dibujar tentáculos antes de la cabeza
    let config = CONFIG.criatura.cabeza;
    let t = (typeof this.tiempo !== 'undefined') ? this.tiempo : 0;
    for (let i = 0; i < config.numeroTentaculos; i++) {
      // Animación: cada tentáculo oscila usando amplitudMovimiento y el tiempo
      let anguloBase = (PI * 2 / config.numeroTentaculos) * i - PI/2;
      let desfase = sin(t * config.amplitudMovimiento + i) * 0.4;
      let angulo = anguloBase + desfase;
      let longitud = cabeza.tamaño * 0.8 + config.longitudTentaculos; // Proporcional a la cabeza
      let x2 = cos(angulo) * longitud;
      let y2 = sin(angulo) * longitud;
      stroke(30, 30, 30);
      strokeWeight(config.grosorTentaculos);
      line(0, 0, x2, y2);
      fill(30, 30, 30);
      noStroke();
      ellipse(x2, y2, config.tamañoPuntas, config.tamañoPuntas);
    }
    stroke(30, 30, 30);
    strokeWeight(CONFIG.criatura.grosorContorno + 1);
    fill(CONFIG.criatura.color[0], CONFIG.criatura.color[1], CONFIG.criatura.color[2], 240);
    let tamaño = cabeza.tamaño * 1.15;
    let forma = cabeza.forma || 'circulo';
    if (forma === 'cuadrado') {
      rectMode(CENTER);
      rect(0, 0, tamaño, tamaño);
    } else if (forma === 'triangulo') {
      let h = tamaño * Math.sqrt(3) / 2;
      beginShape();
      vertex(-tamaño/2, h/3);
      vertex(tamaño/2, h/3);
      vertex(0, -2*h/3);
      endShape(CLOSE);
    } else {
      ellipse(0, 0, tamaño, tamaño);
    }
    // Ojos minimalistas (solo si es círculo o cuadrado)
    if (forma !== 'triangulo') {
      let sep = cabeza.tamaño * 0.22;
      let ojoR = cabeza.tamaño * 0.13;
      fill(30, 30, 30);
      noStroke();
      ellipse(-sep, -ojoR, ojoR, ojoR);
      ellipse(sep, -ojoR, ojoR, ojoR);
    }
    pop();
  }
  
  calcularDesfaseTentaculo(segmento, tentaculoIndex, tiempo, segmentoIndex) {
    const config = CONFIG.criatura.tentaculoDinamico;
    let k = (config.k_factor1 + sin(segmento.y * config.k_y_freq - tiempo) * config.k_factor2) * cos(segmento.x * config.k_x_freq);
    let d = dist(segmento.x, segmento.y, width / 2, height / 2) * config.d_dist_factor; // distancia del centro
    let e = segmento.y * config.e_y_factor;

    let q = config.q_sin_k_amp * sin(k * config.q_sin_k_freq) +
      config.q_inv_k_amp / (k + 0.1) + // evitar división por cero
      sin(segmento.y * config.q_sin_y_freq) * k *
      (config.q_noise_amp1 + config.q_noise_amp2 * sin(e * config.q_noise_e_freq - d * config.q_noise_d_freq + tiempo * config.q_noise_t_freq + tentaculoIndex));

    return q * config.desfaseFinalFactor;
  }
  
  dibujarDetalles() {
    // No detalles extra para mantener el minimalismo
  }
  
  // ===== INTERACCIÓN =====
  
  reaccionarAlMouse(mouseX, mouseY) {
    if (this.modoMovimiento !== 'huir') return; // Solo huir si está en modo huir
    // Reacción al mouse solo si no está sobre el panel
    if (CONFIG.ui.panel.visible && 
        mouseX > CONFIG.ui.panel.x && 
        mouseX < CONFIG.ui.panel.x + CONFIG.ui.panel.width && 
        mouseY > CONFIG.ui.panel.y && 
        mouseY < CONFIG.ui.panel.y + CONFIG.ui.panel.height) {
      return;
    }
    
    let distanciaAlMouse = dist(mouseX, mouseY, this.position.x, this.position.y);
    
    if (distanciaAlMouse < CONFIG.interaccion.distanciaReaccion) {
      let anguloEscape = atan2(this.position.y - mouseY, this.position.x - mouseX);
      
      // Aplicar fuerza de escape gradual
      let factorDistancia = 1 - (distanciaAlMouse / CONFIG.interaccion.distanciaReaccion);
      let fuerzaEscape = CONFIG.interaccion.fuerzaEscape * factorDistancia;
      
      this.position.x += cos(anguloEscape) * fuerzaEscape;
      this.position.y += sin(anguloEscape) * fuerzaEscape;
      
      // Incrementar contador de interacciones
      this.estadisticas.interaccionesConMouse++;
      
      // Aumentar energía por la interacción
      this.aumentarEnergia(0.1);
    }
  }
  
  aumentarEnergia(cantidad) {
    for (let seg of this.segmentos) {
      if (seg) {
        seg.energia = min(1.0, seg.energia + cantidad);
      }
    }
  }
  
  // ===== UTILIDADES =====
  
  reset() {
    this.position.x = width / 2;
    this.position.y = height / 2;
    this.tiempo = 0;
    this.resetEstadisticas();
    this.inicializarSegmentos();
    
    Utils.log("Criatura reiniciada");
  }
  
  // Obtener información de estado
  getInfo() {
    return {
      position: { ...this.position },
      tiempo: Utils.formatNumber(this.tiempo, 2),
      segmentos: this.segmentos.length,
      velocidad: Utils.formatNumber(CONFIG.criatura.velocidadMovimiento, 1),
      energiaPromedio: Utils.formatNumber(this.obtenerEnergiaPromedio(), 2),
      estadisticas: { ...this.estadisticas }
    };
  }
  
  obtenerEnergiaPromedio() {
    if (this.segmentos.length === 0) return 0;
    
    let suma = 0;
    for (let seg of this.segmentos) {
      suma += seg.energia || 0;
    }
    return suma / this.segmentos.length;
  }
  
  // Verificar si está en pantalla
  enPantalla() {
    return this.position.x >= 0 && 
           this.position.x <= width && 
           this.position.y >= 0 && 
           this.position.y <= height;
  }
  
  // Obtener segmento por índice
  obtenerSegmento(indice) {
    return this.segmentos[indice] || null;
  }
  
  // Obtener distancia total de la criatura
  obtenerLongitudTotal() {
    return this.segmentos.length * CONFIG.criatura.distanciaSegmentos;
  }
  
  // Verificar colisión con punto
  colisionConPunto(x, y, radio = 10) {
    for (let seg of this.segmentos) {
      if (seg) {
        let distancia = Utils.distance(x, y, seg.x, seg.y);
        if (distancia < seg.tamaño / 2 + radio) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Aplicar fuerza externa
  aplicarFuerza(fuerzaX, fuerzaY) {
    this.position.x += fuerzaX;
    this.position.y += fuerzaY;
    
    // Aumentar energía por la fuerza aplicada
    let magnitudFuerza = sqrt(fuerzaX * fuerzaX + fuerzaY * fuerzaY);
    this.aumentarEnergia(magnitudFuerza * 0.01);
  }
  
  // Cambiar modo de comportamiento
  cambiarComportamiento(modo) {
    switch(modo) {
      case 'agresivo':
        CONFIG.criatura.velocidadMovimiento *= 1.5;
        CONFIG.criatura.amplitudOndulacion *= 1.2;
        break;
      case 'pasivo':
        CONFIG.criatura.velocidadMovimiento *= 0.7;
        CONFIG.criatura.amplitudOndulacion *= 0.8;
        break;
      case 'normal':
      default:
        // Mantener valores actuales
        break;
    }
    
    Utils.log("Comportamiento cambiado a", modo);
  }

  setModoMovimiento(modo) {
    this.modoMovimiento = modo;
    if (modo !== 'manual') {
      this.direccionManual = { x: 0, y: 0 };
    }
  }

  moverManual(dx, dy) {
    this.direccionManual.x = dx;
    this.direccionManual.y = dy;
  }

  recalcularFormasSegmentos() {
    // No cambiar la forma si ya existe, solo recalcular tamaños
    this.calcularTamañosTercios();
    for (let i = 0; i < this.segmentos.length; i++) {
      let seg = this.segmentos[i];
      if (!seg) continue;
      seg.tamaño = this.terciosSizes[i] || CONFIG.criatura.tamaños.pequeño;
    }
  }
}