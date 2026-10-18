# Bravo

Demo navegable de **Bravo**, una tienda de videojuegos de PC que pone al frente a los estudios latinoamericanos.

**Sitio:** https://w4730.github.io/bravo/

Es una demo académica: no vende juegos ni procesa pagos. Los juegos y estudios son reales; precios, descuentos y requisitos son ilustrativos y las portadas son tipográficas (sin arte oficial).

## Pantallas

| Etapa del journey | Pantalla | Ruta |
| --- | --- | --- |
| Conciencia | Inicio | `#/` |
| Consideración | Catálogo con búsqueda y filtros | `#/catalogo` |
| Consideración | Ficha del juego (requisitos, reseñas verificadas, estudio) | `#/juego/despelote` |
| Consideración | Hecho en Latinoamérica y página de cada estudio | `#/estudios`, `#/estudio/ironhide` |
| Consideración | Pagos, seguridad, reembolsos y soporte | `#/ayuda` |
| Conversión | Carrito, pago y confirmación | `#/carrito`, `#/pagar` |
| Conversión | Ingresar / crear cuenta | `#/ingresar` |
| Lealtad | Biblioteca, lista de deseos, historial y ajustes de correo | `#/cuenta` |
| Estudios | Publica tu juego | `#/publicar` |

El carrito, la biblioteca, las compras y las reseñas se guardan en el navegador (localStorage). «Borrar datos de la demo», en Ajustes, deja todo como nuevo.

## Correr en local

No necesita instalación: abre `index.html` en el navegador.

## Archivos

- `index.html`: estructura, cabecera y pie.
- `styles.css`: sistema visual.
- `data.js`: juegos, estudios, métodos de pago y preguntas frecuentes. Edita aquí el catálogo.
- `app.js`: rutas y pantallas.
