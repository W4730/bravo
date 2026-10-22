---
name: Bravo
description: Tienda de videojuegos de PC con los estudios latinoamericanos al frente, en el idioma visual de un title card de anime.
colors:
  mustard: "#E0B23C"
  brick: "#AA3529"
  teal: "#105F62"
  ink: "#0E0E0E"
  ink-soft: "#4A4136"
  paper: "#F1E6CF"
  paper-deep: "#E7D8B6"
  paper-light: "#FBF5E8"
typography:
  display:
    fontFamily: "Anton, 'Anton Fallback', sans-serif"
    fontSize: "clamp(3.4rem, 8.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Anton, 'Anton Fallback', sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.95
  section:
    fontFamily: "Anton, 'Anton Fallback', sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)"
    fontWeight: 400
    lineHeight: 0.95
  title:
    fontFamily: "'Barlow Condensed', 'Barlow Condensed Fallback', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow, 'Barlow Fallback', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Barlow Condensed', 'Barlow Condensed Fallback', sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.09em"
rounded:
  none: "0"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(48px, 7vw, 88px)"
  card-gap: "22px"
components:
  button-primary:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 26px 11px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.mustard}"
    rounded: "{rounded.none}"
    padding: "12px 26px 11px"
    height: "48px"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 26px 11px"
    height: "48px"
  input:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "48px"
  chip-selected:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
    padding: "7px 14px 6px"
---

# Design System: Bravo

## Overview

**Creative North Star: "The Session Title Card"**

Cada juego entra en Bravo como el corte de título de un episodio de anime: un campo plano de color, una barra que lo atraviesa en diagonal, mayúsculas condensadas que chocan entre sí y un número de sesión estampado. La tienda no es un carrusel oscuro de portadas: es una sucesión de cuadros de color sobre papel crema con grano de imprenta.

La densidad cambia por pantalla: el inicio y «Publica» son carteles de campo completo; catálogo, pago y cuenta son tranquilos, con reglas finas de tinta y el color reservado para portadas, precios y la acción. Las portadas son tipográficas (no hay arte oficial) y llevan el número de sesión que sigue al juego hasta el recibo.

**Key Characteristics:**
- Campos planos de color a página completa, nunca degradados.
- Barras diagonales que cortan el cuadro y pasan detrás del texto.
- Display en Anton, mayúsculas, interlineado apretado; controles en Barlow Condensed.
- Botones, chips y pestañas en paralelogramo (sesgo de −12°).
- Número de sesión «N.º 01» como hilo entre portada, ficha, carrito y recibo.

## Colors

Paleta de title card: tres campos saturados sobre tinta y papel.

### Primary
- **Mostaza de cartel** (#E0B23C): campo del inicio y de las portadas «m», botón primario, pestaña y nav activos, chip seleccionado.

### Secondary
- **Ladrillo** (#AA3529): bloque de la propuesta de valor, banda de estudios, insignia de descuento, segunda línea de títulos sobre mostaza o crema.

### Tertiary
- **Verde azulado profundo** (#105F62): la barra que corta el titular, banda «Hecho en Latinoamérica», viñetas de confianza, foco de formularios.

### Neutral
- **Tinta** (#0E0E0E): texto, reglas de 2–3 px, marcos de portada, pie de página.
- **Tinta suave** (#4A4136): metadatos, notas y precios tachados sobre papel.
- **Papel crema** (#F1E6CF): fondo general con grano.
- **Papel hondo** (#E7D8B6): hover de chips, pestañas y métodos de pago.
- **Papel claro** (#FBF5E8): campos de formulario, resumen de compra, caja del estudio.

### Named Rules
**The Flat Field Rule.** El color se aplica en campos planos que ocupan regiones enteras; el grano (ruido estirado a opacidad .09) es la única textura.
**The Cream-On-Field Rule.** Sobre ladrillo y verde azulado el texto es crema; sobre mostaza y papel, tinta. Ladrillo sobre verde azulado nunca lleva texto (1:1).

## Typography

**Display Font:** Anton (respaldo: Arial con size-adjust 70.9%)
**Body Font:** Barlow 400 y 600 (respaldo: Arial con size-adjust 95.1% / 90.4%)
**Label Font:** Barlow Condensed 700 (respaldo: Arial Bold con size-adjust 67.5%)

**Character:** Anton pone la voz de cartel, comprimida y pesada; Barlow Condensed rotula controles y metadatos con el mismo esqueleto que el Barlow de lectura.

### Hierarchy
- **Display** (400, clamp(3.4rem, 8.6vw, 6rem), 0.86): titular del inicio y títulos de portada; las líneas chocan a propósito.
- **Headline** (400, clamp(2.6rem, 7vw, 5rem), 0.95): h1 de cada pantalla, en mayúsculas.
- **Section** (400, clamp(1.9rem, 3.6vw, 2.8rem), 0.95): cabeceras de sección seguidas de una regla de tinta y una acción.
- **Title** (Barlow Condensed 700, 1.25rem, 0.02em, mayúsculas): nombres de juego en tarjetas y líneas.
- **Body** (400, 1.0625rem, 1.55): descripciones y ayuda, 58–68ch.
- **Label** (Barlow Condensed 700, 0.85rem, 0.09em, mayúsculas): etiquetas de campo, nav, botones.

### Named Rules
**The Accent Clearance Rule.** Un titular de varias líneas con mayúsculas acentuadas después de la primera línea usa interlineado ≥ 0.95.

## Layout

Contenedor de 1360 px con gutter clamp(16px, 4vw, 48px). Las bandas de color van a sangre completa y su contenido vuelve al contenedor. Grillas de portadas con `auto-fill, minmax(190px, 1fr)` (dos columnas bajo 520 px); carriles horizontales con scroll-snap para ofertas. Ficha, carrito y pago usan dos columnas (contenido + caja pegajosa de 300–380 px) que se apilan bajo 900 px. Bajo 760 px la navegación pasa a una barra inferior de tinta y la búsqueda a un ícono.

## Elevation & Depth

Sistema plano. No hay sombras: la profundidad sale de campos de color superpuestos, marcos de tinta de 2–3 px y barras que pasan por detrás del texto.

### Named Rules
**The No-Shadow Rule.** La jerarquía se marca con color de campo y peso de regla, nunca con sombras.

## Shapes

Esquinas rectas en todo (radio 0). La única geometría expresiva es el sesgo de −12° de botones, chips, pestañas y números, y las barras diagonales rotadas entre −5° y −16° en portadas y bandas. Los bloques de campo pueden recortarse con polígonos de cuatro vértices (bloque ladrillo del inicio, cuña inferior de la ficha).

## Components

### Buttons
- **Shape:** paralelogramo por pseudo-elemento sesgado (−12°), sin radio.
- **Primary:** mostaza con texto tinta, Barlow Condensed 700 en mayúsculas, alto mínimo 48 px.
- **Hover / Focus:** una barra de 4 px se desliza bajo el botón (scaleX, 0.35 s ease-out); foco con contorno de 3 px (tinta, o mostaza sobre campos oscuros).
- **Ghost / Ink:** ghost con borde de 2 px en currentColor; ink con fondo tinta y texto mostaza para bandas ladrillo.

### Chips
- **Style:** paralelogramo con borde de tinta de 2 px.
- **State:** seleccionado en mostaza; el radio o checkbox real queda encima, invisible.

### Cards / Containers
- **Corner Style:** recto.
- **Background:** la portada lleva el campo de su esquema (m, b, t, k, c); las cajas de compra y resumen, papel con marco de tinta de 3 px.
- **Shadow Strategy:** ninguna.
- **Internal Padding:** 22 px.

### Inputs / Fields
- **Style:** borde de tinta de 2 px, fondo papel claro, 48 px de alto.
- **Focus:** contorno verde azulado de 3 px con separación de 2 px.
- **Error:** borde ladrillo con `:user-invalid`.

### Navigation
- Barlow Condensed 700 en mayúsculas. El activo se estampa con un paralelogramo mostaza; el hover desliza una barra de tinta. En móvil es una barra inferior fija de tinta con texto crema.

### Title Card (portada)
Campo de color de 3:4 con marco de tinta, título en Anton escalado por container queries, segunda línea en el color secundario, barra diagonal y número de sesión subrayado. Tres composiciones según el número: título arriba y número abajo a la derecha; título abajo y número arriba; número abajo a la izquierda. Al pasar el cursor entra una barra fina y el número se estampa.

### Running-Order Strip
Tira de números 01–20 en Anton dentro de la banda de la ficha; cada número enlaza a su juego y el actual se estampa en el color de título sobre el campo.

## Do's and Don'ts

### Do:
- **Do** usar los cinco esquemas de campo (mostaza, ladrillo, verde azulado, tinta, crema) para portadas y bandas.
- **Do** llevar el número de sesión del juego a todo lugar donde aparezca.
- **Do** rotular como ilustrativo todo precio, requisito o pago de la demo.

### Don't:
- **Don't** usar degradados, vidrio o sombras.
- **Don't** poner etiquetas pequeñas encima de los títulos; el título habla solo.
- **Don't** inventar reseñas, clientes o cifras: las reseñas solo existen si alguien compra en la demo.
