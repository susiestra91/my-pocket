# My Pocket

Registro minimalista de gastos diarios, semanales y mensuales. Sin base de datos: todo se guarda en el `localStorage` del navegador.

## Características

- Detección **100% local** de país y moneda (zona horaria + idioma del navegador vía `Intl`), sin llamadas de red. Selector manual de moneda siempre disponible.
- Vistas por día, semana y mes con total y gráfico por categoría.
- Diseño mobile-first (funciona en celular y escritorio).

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Recharts.

## Desarrollo

Requiere Node 22 (ver `.nvmrc`).

```bash
npm install
npm run dev      # servidor de desarrollo
npm run lint     # oxlint
npm run build    # build de producción en dist/
```

## Deploy

El build es estático: sube `dist/` a Vercel, Netlify o GitHub Pages.
