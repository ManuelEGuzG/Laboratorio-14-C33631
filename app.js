import express from "express";
import { cwd } from "node:process";

import { getAll } from "./routes/albumes/getAll.js";
import { getBySlug } from "./routes/albumes/getBySlug.js";
import { getByGenero } from "./routes/albumes/getByGenero.js";
import { search } from "./routes/albumes/search.js";
import { create } from "./routes/albumes/create.js";
import { update } from "./routes/albumes/update.js";
import { remove } from "./routes/albumes/remove.js";

const app = express();
app.enable("strict routing");
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    nombre: "DiscoStore API",
    version: "1.0.0",
    descripcion: "API REST para administrar el catalogo de albumes de una tienda de musica",
    rutas: {
      "GET /albumes": "Lista de slugs de todos los albumes",
      "GET /album/:slug": "Datos de un album por su slug",
      "GET /genero/:genero": "Slugs de albumes de ese genero",
      "GET /search/:text": "Busqueda por texto (minimo 3 caracteres)",
      "POST /albumes": "Crear un nuevo album",
      "PUT /album/:slug": "Actualizar un album existente",
      "DELETE /album/:slug": "Eliminar un album",
      "GET /imagenes/:file": "Imagenes de los albumes"
    }
  });
});

app.get("/albumes", getAll);
app.get("/album/:slug", getBySlug);
app.get("/genero/:genero", getByGenero);
app.get("/search/:text", search);

app.post("/albumes", create);
app.put("/album/:slug", update);
app.delete("/album/:slug", remove);

app.use("/imagenes", express.static(`${cwd()}/public/imagenes`));

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;