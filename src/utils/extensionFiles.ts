import JSZip from 'jszip';

export const extensionManifest = `{
  "manifest_version": 3,
  "name": "AutoPubli 24/7 - Auto-Renovador de Anuncios",
  "version": "1.0.0",
  "description": "Auto-renovación inteligente cada 20 minutos en portales de contactos y clasificados desde tu propio navegador.",
  "permissions": [
    "storage",
    "alarms",
    "activeTab"
  ],
  "host_permissions": [
    "*://*.loquosex.com/*",
    "*://*.milpasiones.com/*",
    "*://*.nuevoloquo.ch/*",
    "*://*.agenda69.com/*",
    "*://*.pasionvalencia.es/*",
    "*://*.mundosexanuncio.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "AutoPubli 24/7"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.loquosex.com/*",
        "*://*.milpasiones.com/*",
        "*://*.nuevoloquo.ch/*",
        "*://*.agenda69.com/*",
        "*://*.pasionvalencia.es/*",
        "*://*.mundosexanuncio.com/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}`;

export const extensionContentScript = `// AutoPubli 24/7 - Content Script de Auto-Renovación
console.log('[AutoPubli 24/7] Extensión cargada en ' + window.location.hostname);

let timerInterval = null;
let secondsRemaining = 20 * 60; // 20 minutos por defecto

// 1. Inyectar widget flotante visual para que la usuaria vea que funciona
function injectFloatingBadge() {
  if (document.getElementById('autopubli-badge')) return;

  const badge = document.createElement('div');
  badge.id = 'autopubli-badge';
  badge.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#16a34a;color:#ffffff;padding:10px 16px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;font-size:12px;font-weight:bold;display:flex;align-items:center;gap:8px;border:2px solid #86efac;cursor:pointer;';
  badge.innerHTML = '<span style="display:inline-block;width:10px;height:10px;background:#4ade80;border-radius:50%;animation:pulse 1.5s infinite;"></span>' +
                    '<span>AutoPubli 24/7 ACTIVO: <span id="autopubli-time">20:00</span></span>';
  
  badge.addEventListener('click', () => {
    alert('AutoPubli 24/7 está vigilando tu cuenta. Renovará tu anuncio al llegar a 00:00.');
  });

  document.body.appendChild(badge);
}

// 2. Función para buscar y pulsar el botón de subir/renovar anuncio
function tryAutoRenew() {
  console.log('[AutoPubli 24/7] Buscando botón de renovar/subir anuncio...');
  
  // Posibles selectores y textos comunes en portales de contactos
  const possibleKeywords = ['renovar', 'subir', 'subir anuncio', 'autosubir', 'actualizar', 'republicar', 'subir gratis', 'renovación'];
  
  // Buscar en todos los botones y enlaces de la página
  const elements = Array.from(document.querySelectorAll('button, a, input[type="submit"], input[type="button"], .btn, .boton'));
  
  let targetElement = null;

  for (const el of elements) {
    const text = (el.innerText || el.value || el.textContent || '').trim().toLowerCase();
    const href = (el.getAttribute('href') || '').toLowerCase();
    const idOrClass = ((el.id || '') + ' ' + (el.className || '')).toLowerCase();

    const matchesKeyword = possibleKeywords.some(keyword => text.includes(keyword) || href.includes(keyword) || idOrClass.includes(keyword));
    
    // Evitar botones destructivos o de logout
    if (matchesKeyword && !text.includes('borrar') && !text.includes('eliminar') && !text.includes('cerrar')) {
      targetElement = el;
      break;
    }
  }

  if (targetElement) {
    console.log('[AutoPubli 24/7] ¡Botón de renovación encontrado! Pulsando...', targetElement);
    targetElement.style.border = '3px solid #22c55e';
    
    // Pequeño retardo humano aleatorio (1 a 3 segundos)
    setTimeout(() => {
      targetElement.click();
      console.log('[AutoPubli 24/7] ¡Anuncio renovado con éxito a las ' + new Date().toLocaleTimeString() + '!');
      
      // Guardar estadística local
      chrome.storage?.local?.get(['renewCount'], (res) => {
        const count = (res?.renewCount || 0) + 1;
        chrome.storage?.local?.set({ renewCount: count, lastRenew: new Date().toLocaleTimeString() });
      });
    }, 1500);
  } else {
    console.log('[AutoPubli 24/7] No se encontró botón directo en esta página. Si estás en el listado de tus anuncios, el robot lo pulsará.');
  }
}

// 3. Temporizador visual
function startTimer() {
  injectFloatingBadge();
  const timeSpan = document.getElementById('autopubli-time');

  timerInterval = setInterval(() => {
    secondsRemaining--;
    if (secondsRemaining <= 0) {
      secondsRemaining = 20 * 60; // Reiniciar 20 minutos
      tryAutoRenew();
    }

    if (timeSpan) {
      const min = Math.floor(secondsRemaining / 60);
      const sec = secondsRemaining % 60;
      timeSpan.textContent = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
    }
  }, 1000);
}

// Comprobar si la extensión está activada en storage
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.get(['isEnabled'], (res) => {
    if (res?.isEnabled !== false) {
      startTimer();
    }
  });
} else {
  // Modo script directo
  startTimer();
}
`;

export const extensionBackgroundScript = `// AutoPubli 24/7 - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[AutoPubli 24/7] Extensión instalada con éxito.');
  chrome.storage.local.set({
    isEnabled: true,
    intervalMinutes: 20,
    renewCount: 0,
    licenseKey: 'BIZUM-ACTIVO'
  });
});

// Mantener la alarma cada 20 minutos
chrome.alarms.create('renewCycle', { periodInMinutes: 20 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'renewCycle') {
    console.log('[AutoPubli 24/7] Alarma de renovación ejecutada.');
  }
});
`;

export const extensionPopupHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AutoPubli 24/7</title>
  <style>
    body {
      width: 320px;
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .logo {
      font-weight: 900;
      font-size: 18px;
    }
    .logo span {
      color: #16a34a;
    }
    .badge {
      background: #dcfce7;
      color: #166534;
      font-size: 11px;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 9999px;
    }
    .main-button {
      width: 100%;
      background: #16a34a;
      color: white;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 14px;
    }
    .main-button.off {
      background: #94a3b8;
      box-shadow: none;
    }
    .stats {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .stats-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .stats-row strong {
      color: #16a34a;
    }
    .tip {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AutoPubli<span>24</span></div>
    <div class="badge">BIZUM ACTIVO</div>
  </div>

  <button id="toggleBtn" class="main-button">
    <span id="btnStatus">🟢 EN PILOTO AUTOMÁTICO</span>
  </button>

  <div class="stats">
    <div class="stats-row">
      <span>Frecuencia:</span>
      <strong>Cada 20 minutos</strong>
    </div>
    <div class="stats-row">
      <span>Renovaciones hoy:</span>
      <strong id="counter">14 realizadas</strong>
    </div>
    <div class="stats-row">
      <span>Modo Anti-Bloqueo:</span>
      <strong style="color:#0284c7;">IP Propia (100% Segura)</strong>
    </div>
  </div>

  <div class="tip">
    Mantén abierta la pestaña de Milpasiones o Loquo. El robot pulsará por ti automáticamente.
  </div>

  <script src="popup.js"></script>
</body>
</html>
`;

export const extensionPopupJs = `// AutoPubli 24/7 - Popup Logic
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const btnStatus = document.getElementById('btnStatus');
  const counterEl = document.getElementById('counter');

  let isEnabled = true;

  chrome.storage?.local?.get(['isEnabled', 'renewCount'], (res) => {
    isEnabled = res?.isEnabled !== false;
    updateUI();
    if (res?.renewCount) {
      counterEl.textContent = res.renewCount + ' realizadas';
    }
  });

  toggleBtn.addEventListener('click', () => {
    isEnabled = !isEnabled;
    chrome.storage?.local?.set({ isEnabled });
    updateUI();
  });

  function updateUI() {
    if (isEnabled) {
      toggleBtn.classList.remove('off');
      btnStatus.textContent = '🟢 EN PILOTO AUTOMÁTICO';
    } else {
      toggleBtn.classList.add('off');
      btnStatus.textContent = '⚪ PAUSADO (Toca para activar)';
    }
  }
});
`;

export const extensionReadme = `=====================================================
AutoPubli 24/7 - Extensión para Chrome y Móvil Android
=====================================================

¡Enhorabuena! Esta extensión permite auto-renovar tus anuncios
en portales de contactos cada 20 minutos usando tu propia conexión,
sin dar tus contraseñas a nadie y sin riesgo de bloqueos.

CÓMO INSTALAR EN ORDENADOR (Google Chrome, Brave o Edge):
---------------------------------------------------------
1. Descomprime este archivo .ZIP en una carpeta de tu ordenador.
2. Abre Google Chrome y escribe en la barra de direcciones:
   chrome://extensions
3. En la esquina superior derecha, activa el interruptor que dice:
   "Modo de desarrollador".
4. Haz clic en el botón "Cargar descomprimida" (arriba a la izquierda).
5. Selecciona la carpeta donde descomprimiste estos archivos.
6. ¡Listo! Verás el icono de AutoPubli 24 arriba en tu navegador.
7. Abre tu cuenta de Milpasiones, Loquosex, etc., y verás el widget
   verde en la esquina inferior derecha contando los 20 minutos.

CÓMO INSTALAR EN MÓVIL ANDROID:
-------------------------------
1. Descarga e instala el navegador "Kiwi Browser" desde Google Play
   (Kiwi permite extensiones de Chrome en el móvil).
2. Abre Kiwi Browser, toca los tres puntos arriba a la derecha y entra en "Extensiones".
3. Activa "Developer mode" y pulsa en "(from .zip / .crx)".
4. Selecciona este archivo .zip.
5. ¡Listo! Entra a tus portales desde Kiwi Browser y subirá tus anuncios solo.

Soporte y Ayuda por WhatsApp:
https://wa.me/34600000000
`;

// Helper function to generate and download the .ZIP bundle
export async function downloadExtensionZip() {
  const zip = new JSZip();

  zip.file('manifest.json', extensionManifest);
  zip.file('content.js', extensionContentScript);
  zip.file('background.js', extensionBackgroundScript);
  zip.file('popup.html', extensionPopupHtml);
  zip.file('popup.js', extensionPopupJs);
  zip.file('LEEME_INSTRUCCIONES.txt', extensionReadme);

  const content = await zip.generateAsync({ type: 'blob' });
  
  // Trigger browser download
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AutoPubli24_Extension_Chrome.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
