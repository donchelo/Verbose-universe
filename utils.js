// ===============================
// UTILS.JS - FUNCIONES AUXILIARES
// ===============================

// Verificar carga
if (typeof window !== 'undefined') {
  console.log("✓ utils.js cargado");
}

// Namespace para utilidades
window.Utils = {
  
  // ===== MATEMÁTICAS =====
  
  // Mapear valor entre rangos
  mapRange: function(value, fromLow, fromHigh, toLow, toHigh) {
    return toLow + (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow);
  },
  
  // Interpolación suave
  lerp: function(start, end, factor) {
    return start + (end - start) * factor;
  },
  
  // Constrain valor entre límites
  constrain: function(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  
  // Distancia entre dos puntos
  distance: function(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },
  
  // Ángulo entre dos puntos
  angle: function(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },
  
  // Número aleatorio entre min y max
  random: function(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  },
  
  // ===== VALIDACIÓN =====
  
  // Verificar si un objeto existe y tiene propiedades
  isValid: function(obj) {
    return obj !== null && obj !== undefined;
  },
  
  // Verificar si un número es válido
  isValidNumber: function(num) {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  },
  
  // ===== COLOR =====
  
  // Convertir HSV a RGB
  hsvToRgb: function(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  
  // Generar color aleatorio
  randomColor: function() {
    return [
      Math.floor(Utils.random(0, 256)),
      Math.floor(Utils.random(0, 256)),
      Math.floor(Utils.random(0, 256))
    ];
  },
  
  // ===== ARRAYS =====
  
  // Clonar array profundo
  cloneArray: function(arr) {
    return JSON.parse(JSON.stringify(arr));
  },
  
  // Obtener elemento aleatorio de array
  randomElement: function(arr) {
    return arr[Math.floor(Utils.random(arr.length))];
  },
  
  // ===== VALIDACIÓN DE LÍMITES =====
  
  // Aplicar límites de configuración
  applyLimits: function(value, limitKey) {
    const limit = window.CONSTANTES && window.CONSTANTES.LIMITES ? window.CONSTANTES.LIMITES[limitKey] : null;
    if (limit) {
      return Utils.constrain(value, limit.min, limit.max);
    }
    return value;
  },
  
  // ===== FORMATEO =====
  
  // Formatear número con decimales
  formatNumber: function(num, decimals = 1) {
    return parseFloat(num.toFixed(decimals));
  },
  
  // ===== GEOMETRÍA =====
  
  // Rotar punto alrededor de otro punto
  rotatePoint: function(x, y, centerX, centerY, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - centerX;
    const dy = y - centerY;
    
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  },
  
  // Calcular punto en círculo
  pointOnCircle: function(centerX, centerY, radius, angle) {
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  },
  
  // ===== TIEMPO =====
  
  // Obtener timestamp actual
  now: function() {
    return Date.now();
  },
  
  // Deltatime entre dos timestamps
  deltaTime: function(previous, current) {
    return current - previous;
  },
  
  // ===== EASING =====
  
  // Easing suave (smooth step)
  smoothStep: function(t) {
    return t * t * (3 - 2 * t);
  },
  
  // Easing más suave (smoother step)
  smootherStep: function(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  },
  
  // Easing de rebote
  bounceEase: function(t) {
    if (t < 1/2.75) {
      return 7.5625 * t * t;
    } else if (t < 2/2.75) {
      return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
    } else if (t < 2.5/2.75) {
      return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
    }
  },
  
  // ===== DEBUG =====
  
  // Log con formato
  log: function(message, data = null) {
    if (data) {
      console.log(`[UTILS] ${message}:`, data);
    } else {
      console.log(`[UTILS] ${message}`);
    }
  },
  
  // Warning con formato
  warn: function(message, data = null) {
    if (data) {
      console.warn(`[UTILS] ${message}:`, data);
    } else {
      console.warn(`[UTILS] ${message}`);
    }
  },
  
  // Error con formato
  error: function(message, data = null) {
    if (data) {
      console.error(`[UTILS] ${message}:`, data);
    } else {
      console.error(`[UTILS] ${message}`);
    }
  }
};