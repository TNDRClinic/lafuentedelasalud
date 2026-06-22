# La Fuente de la Salud — guía del proyecto

Sitio web estático (HTML + CSS inline por archivo) de una consulta de
nutrición integrativa y terapias en Bilbao.

## Paleta de color — OBLIGATORIO

Antes de añadir o cambiar cualquier color, consulta **[PALETA.md](PALETA.md)**.
Solo se usan los 5 colores oficiales y sus derivados documentados. **No
introduzcas tonos nuevos** que no salgan de esa paleta. Usa siempre los
tokens CSS (`var(--purple)`, `var(--rose-md)`, etc.) en vez de hex sueltos.

Resumen rápido (ver PALETA.md para el detalle):
- Crema `#FBF6F2` · Rosa `#E6B8C6` · Lila `#AE9FC6` · Morado `#7A5C8F` · Taupe `#766F74`
- Tipografías: **Pinyon Script** (cursiva, solo marca/acento) + **Raleway** (todo lo demás)

## Tipografía y jerarquía — OBLIGATORIO

Regla de marca (decisión de Iratxe, junio 2026):
- La **cursiva** (`var(--font-title)`, Pinyon Script) se usa **solo** en:
  1. el logotipo «La Fuente de la Salud» (`.nav-logo-text`), y
  2. el eslogan del hero de la home («Tu cuerpo habla. Traduzcamos juntas su mensaje.», `.hero-slogan`).
  **No usar cursiva en ningún otro título.**
- El resto de títulos van en **Raleway**: las etiquetas/títulos de sección
  cortos en **MAYÚSCULAS** (`text-transform: uppercase`, `font-weight: 700`,
  `letter-spacing: ~0.03em`); los titulares largos en Raleway 700 en caja normal.

Otras reglas de estilo:
- **Morado como acento**, no como fondo. Evita secciones enteras con fondo
  morado sólido (solo el footer y la banda CTA final quedan oscuros).
- **Iconos siempre dibujados** (SVG de línea, `stroke="currentColor"`).
  No usar emojis (📍📞✉️🚇🌱…) en el contenido.

## Estructura

- Páginas del sitio (raíz): `index.html`, `servicios.html`, `sobre-mi.html`,
  `aviso-legal.html`, `politica-privacidad.html`, `politica-cookies.html`.
- Cada `.html` lleva su propio bloque `<style>` con el mismo `:root` de tokens.
  Si cambias un token, cámbialo en **todos** los archivos para mantener la coherencia.
- `iratxe/project/` es una copia/borrador antiguo, **no** es el sitio publicado.
