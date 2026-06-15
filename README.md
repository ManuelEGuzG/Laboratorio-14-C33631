# DiscoStore API 🎵

API REST construida con Node.js y Express para administrar el catálogo de álbumes de una tienda de música.

## Tecnologías

- **Node.js** v22+
- **Express** v5
- **SQLite** (nativo de Node.js, módulo `node:sqlite`)
- **Zod** (validación de datos)
- **pnpm** (gestor de paquetes)

## Requisitos previos

- Node.js v22 o superior
- pnpm instalado

```bash
npm install -g pnpm
```

## Instalación

```bash
git clone <url-del-repositorio>
cd discostore-api
pnpm install
```

## Poblar la base de datos

Antes de iniciar el servidor, crear y poblar la base de datos SQLite:

```bash
pnpm run createdb
```

Esto lee `data/data.json` y crea `data/albumes.db` con los 10 álbumes iniciales.

## Iniciar el servidor

```bash
# Producción
pnpm start

# Desarrollo (con recarga automática)
pnpm dev
```

El servidor escucha en `http://localhost:4321`.

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información general de la API |
| GET | `/albumes` | Lista de slugs de todos los álbumes |
| GET | `/album/:slug` | Datos de un álbum específico |
| GET | `/genero/:genero` | Slugs de álbumes de ese género |
| GET | `/search/:text` | Búsqueda por texto (mínimo 3 caracteres) |
| POST | `/albumes` | Crear un nuevo álbum |
| PUT | `/album/:slug` | Actualizar un álbum existente |
| DELETE | `/album/:slug` | Eliminar un álbum |
| GET | `/imagenes/:archivo` | Imágenes de los álbumes (.avif) |

## Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK — lectura exitosa o actualización (PUT) exitosa |
| 201 | Created — POST creó un recurso. Incluye cabecera Location |
| 204 | No Content — DELETE exitoso, sin cuerpo en la respuesta |
| 400 | Bad Request — la validación de Zod falló |
| 404 | Not Found — el recurso no existe |
| 409 | Conflict — POST intenta crear un álbum con slug ya existente |

## Ejemplos con xh

```bash
# Lectura
xh GET :4321/albumes
xh GET :4321/album/thriller
xh GET :4321/album/inexistente       # -> 404 JSON
xh GET :4321/genero/Rock
xh GET :4321/search/jackson
xh GET :4321/search/ab               # -> 400 JSON (mínimo 3 caracteres)

# Escritura
xh POST :4321/albumes titulo="OK Computer" artista="Radiohead" genero="Rock Alternativo" anio:=1997 sello="Parlophone" pistas:=12 imagen="ok-computer.avif" slug="ok-computer" resumen="Obra maestra." descripcion="Tercer album de Radiohead."

xh PUT :4321/album/ok-computer titulo="OK Computer OKNOTOK" artista="Radiohead" genero="Rock Alternativo" anio:=1997 sello="Parlophone" pistas:=12 imagen="ok-computer.avif" slug="ok-computer" resumen="Edicion aniversario." descripcion="Version remasterizada."

xh DELETE :4321/album/ok-computer
```

## Estructura del proyecto

```
discostore-api/
├── data/
│   ├── CREATE.SQL          # Script SQL para crear la tabla
│   ├── createdb.js         # Script para poblar la BD
│   ├── data.json           # Datos fuente (10 álbumes)
│   ├── albumes.js          # Repositorio de datos
│   └── albumes.db          # Base de datos SQLite (generada)
├── public/
│   └── imagenes/           # Imágenes .avif de cada álbum
├── routes/
│   └── albumes/
│       ├── album.schema.js     # Schema Zod para crear/actualizar
│       ├── slug.schema.js      # Schema Zod para slug
│       ├── search.schema.js    # Schema Zod para búsqueda
│       ├── getAll.js           # GET /albumes
│       ├── getBySlug.js        # GET /album/:slug
│       ├── getByGenero.js      # GET /genero/:genero
│       ├── search.js           # GET /search/:text
│       ├── create.js           # POST /albumes
│       ├── update.js           # PUT /album/:slug
│       └── remove.js           # DELETE /album/:slug
├── .env                    # Variables de entorno (HOST, PORT)
├── .gitignore
├── index.js                # Entrada principal de la API
├── package.json
├── README.md
└── REFERENCIAS.md
```

## Estructura de datos

```json
{
  "titulo": "Thriller",
  "artista": "Michael Jackson",
  "genero": "Pop",
  "anio": 1982,
  "sello": "Epic",
  "pistas": 9,
  "imagen": "thriller.avif",
  "slug": "thriller",
  "resumen": "El album mas vendido de la historia.",
  "descripcion": "Album de Michael Jackson que redefinio la musica pop de los anos 80."
}
```
