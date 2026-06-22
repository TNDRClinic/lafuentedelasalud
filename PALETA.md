# Paleta de color e identidad — La Fuente de la Salud

Paleta **oficial** extraída del manual de identidad
(`Propuesta_ID_LaFuenteDeLaSalud_V4`). **Cualquier color nuevo que se
incorpore al sitio debe salir de aquí.** No se introducen tonos que no
deriven de estos cinco.

## Colores oficiales (5)

| Rol en la marca | Uso | HEX | RGB |
|---|---|---|---|
| Crema | Fondos | `#FBF6F2` | 251, 246, 242 |
| Rosa (logo) | Principal · acentos, etiquetas | `#E6B8C6` | 230, 184, 198 |
| Lila | Secundario · detalles, focus | `#AE9FC6` | 174, 159, 198 |
| Morado (logo) | Principal · botones, títulos, iconos | `#7A5C8F` | 122, 92, 143 |
| Gris/Taupe | Textos · secundario | `#766F74` | 118, 111, 116 |

- **Principales (los del logo):** Rosa `#E6B8C6` + Morado `#7A5C8F`
- **Secundarios (fondos, botones, textos):** Crema `#FBF6F2`, Lila `#AE9FC6`, Taupe `#766F74`

## Derivados permitidos

Tonos auxiliares necesarios para la web, todos derivados de los oficiales:

| Token | HEX | Origen |
|---|---|---|
| `--text` (texto principal) | `#463F43` | Taupe `#766F74` oscurecido para legibilidad |
| `--rose-lt` (rosa claro, fondos suaves) | `#F2DCE3` | Tinte claro de la rosa oficial |
| `--purple` hover | `#674C7A` | Morado `#7A5C8F` oscurecido |
| gradiente intermedio | `#E2D6E4` | Mezcla suave rosa/lila → crema |
| `--white` | `#FEFCFD` | Blanco neutro (no es color de marca) |

> Para opacidades usar el RGB oficial con `rgba()`, p.ej. sombras
> `rgba(122,92,143,0.08)` (morado).

## Excepciones (no son de marca, no cambiar)

- **Verde WhatsApp** `#25D366` / `#1FB958` / `#1A7A40` — color funcional del botón de WhatsApp.
- **Amarillo "completar"** `#FFF3CD` / `#856404` — marcadores temporales de "rellenar"
  en las páginas legales; deben resaltar a propósito.

## Tipografías

- **Títulos / display:** `Pinyon Script` (script)
- **Texto / cuerpo:** `Raleway`

## Tokens CSS (`:root`, idénticos en todos los `.html`)

```css
--cream:   #FBF6F2;  /* fondo crema oficial */
--rose-lt: #F2DCE3;  /* tinte claro de la rosa */
--rose-md: #E6B8C6;  /* rosa oficial (logo) */
--mauve:   #AE9FC6;  /* lila oficial */
--purple:  #7A5C8F;  /* morado oficial (logo) */
--taupe:   #766F74;  /* taupe oficial */
--white:   #FEFCFD;  /* blanco neutro */
--text:    #463F43;  /* texto principal (taupe oscurecido) */
--text-lt: #766F74;  /* texto secundario (taupe oficial) */
```

> Nota: la carpeta `iratxe/project/` es una copia/borrador antiguo y **no**
> forma parte del sitio publicado; conserva los colores previos.
