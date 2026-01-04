# Star ✦ - Oráculo en Vercel

Repositorio reducido a lo esencial para el oráculo desplegado en Vercel.

## Contenido esencial

- `index.html`: interfaz principal del oráculo.
- `public/`: assets, data y módulos de i18n.
- `api/index.py`: función serverless (Gemini) servida por Vercel.
- `vercel.json`: rutas y builds de Vercel.
- `requirements.txt`: dependencias Python para la función.
- `package.json` / `package-lock.json`: soporte mínimo para CLI de Vercel.

## Despliegue rápido

1. Instala Vercel CLI si lo necesitas: `npm i -g vercel`.
2. Ejecuta `vercel --prod` (la config existente ya apunta a `index.html`, `public/` y `api/index.py`).

## Uso local

- Sirve el frontend con cualquier servidor estático (`npx serve .`).
- La función Python está pensada para entorno Vercel; asegúrate de tener las credenciales de Vertex AI disponibles si la invocas localmente.
