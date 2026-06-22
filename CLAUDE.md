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
- Tipografías: **Pinyon Script** (títulos) + **Raleway** (cuerpo)

## Estructura

- Páginas del sitio (raíz): `index.html`, `servicios.html`, `sobre-mi.html`,
  `aviso-legal.html`, `politica-privacidad.html`, `politica-cookies.html`.
- Cada `.html` lleva su propio bloque `<style>` con el mismo `:root` de tokens.
  Si cambias un token, cámbialo en **todos** los archivos para mantener la coherencia.
- `iratxe/project/` es una copia/borrador antiguo, **no** es el sitio publicado.
