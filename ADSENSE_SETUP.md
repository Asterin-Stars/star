# Guía Definitiva: Monetización y Despliegue (Google AdSense)

## 1. Configuración Esencial (Quick Start)

### Paso A: Obtener Credenciales

1.  Ve a [Google AdSense](https://adsense.google.com/).
2.  Crea una cuenta o inicia sesión.
3.  Ve a **Sitios > Agregar sitio** e introduce tu dominio (ej. `star-oracle.vercel.app` o tu dominio propio).
4.  Ve a **Cuenta > Configuración > Información de la cuenta** y copia tu **ID de editor** (Pub-ID).
    - Formato: `ca-pub-XXXXXXXXXXXXXXXX`

### Paso B: Actualizar el Código

Edita el archivo `src/js/ads.js` y reemplaza el ID de marcador de posición:

```javascript
// src/js/ads.js
const ADSENSE_CLIENT_ID = "ca-pub-TU_ID_REAL_AQUI"; // Reemplazar
```

## 2. Optimización de Ingresos (Best Practices)

### Unidades de Anuncios

Hemos implementado un **Sticky Banner** (Anuncio anclado) en la parte inferior. Este es el formato de mayor rendimiento para móviles (high CTR).

- **Tamaño**: 320x50 (Móvil estándar) o Adaptable.
- **Comportamiento**: Se mantiene visible mientras el usuario hace scroll, sin obstruir la lectura de la carta.

### Recomendaciones para Maximizar RPM:

1.  **Anuncios Automáticos (Auto Ads)**:
    - En el panel de AdSense, activa "Anuncios automáticos" para tu sitio.
    - Esto permitirá a Google insertar intersticiales (vignettes) entre cambios de página o lecturas, que pagan muy bien.
2.  **Categorías Sensibles**:
    - Ve a "Controles de bloqueo" en AdSense.
    - Permite categorías relacionadas con "Esoterismo", "Astrología" y "Bienestar", ya que suelen tener buena afinidad con tu audiencia.
3.  **Carga Diferida (Lazy Loading)**:
    - Nuestro código ya implementa una carga optimizada. El script de AdSense se inyecta dinámicamente solo si no está presente, mejorando la velocidad inicial (Core Web Vitals).

## 3. Seguridad y Verificación

### Archivo `ads.txt` (CRÍTICO)

Para evitar fraude y asegurar que recibes los pagos, debes tener un archivo `ads.txt` en la raíz de tu dominio.

1.  Descarga tu `ads.txt` desde el panel de AdSense.
2.  Súbelo a la carpeta `public/` o `root` de tu proyecto.
3.  Asegúrate de que sea accesible en `tudominio.com/ads.txt`.

### Sitios Autorizados

1.  En AdSense, ve a **Sitios > Autorización del sitio**.
2.  Activa "Solo autorizar mis sitios verificados".
3.  Asegúrate de que tu dominio (incluyendo subdominios de Vercel si usas) esté en la lista "Ready".

## 4. Checklist de Despliegue (Deployment)

Antes de subir a producción:

- [ ] **Modo Amigos**: Verifica que `IS_FRIENDS_MODE` en `src/js/wallet.js` esté en `false` si quieres cobrar WLD real, o `true` si es una versión gratuita/demo.
- [ ] **ID de AdSense**: Confirma que has puesto tu ID real en `src/js/ads.js`.
- [ ] **Ads.txt**: Verifica que el archivo existe en el despliegue.
- [ ] **MiniKit**: Asegúrate de que el ID de la app (app_id) en el Developer Portal de World App coincida con tu configuración si usas características avanzadas.

---

**Nota sobre Preloader**: El preloader está diseñado para ocultarse automáticamente una vez que AdSense y los assets gráficos hayan cargado. Si notas que tarda mucho, revisa la consola del navegador para ver si hay errores de bloqueo por AdBlockers (común en desarrollo).
