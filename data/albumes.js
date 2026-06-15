import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

const db = new DatabaseSync(`${cwd()}/data/albumes.db`);

export const getAll = () => {
  const query = db.prepare("SELECT slug FROM albumes ORDER BY anio ASC");
  return query.all();
};

export const getBySlug = (slug) => {
  const query = db.prepare("SELECT * FROM albumes WHERE slug = ?");
  return query.get(slug);
};

export const getByGenero = (genero) => {
  const query = db.prepare("SELECT slug FROM albumes WHERE genero = ? ORDER BY anio ASC");
  return query.all(genero);
};

export const search = (text) => {
  const query = db.prepare(`
    SELECT slug FROM albumes
    WHERE titulo LIKE ?
       OR artista LIKE ?
       OR genero LIKE ?
       OR sello LIKE ?
       OR resumen LIKE ?
       OR descripcion LIKE ?
    ORDER BY anio ASC
  `);
  const param = `%${text}%`;
  return query.all(param, param, param, param, param, param);
};

export const create = (album) => {
  const query = db.prepare(`
    INSERT INTO albumes (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
    VALUES (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
  `);
  const result = query.run(album);
  return getBySlug(album.slug);
};

export const update = (slug, album) => {
  const query = db.prepare(`
    UPDATE albumes SET
      titulo = :titulo,
      artista = :artista,
      genero = :genero,
      anio = :anio,
      sello = :sello,
      pistas = :pistas,
      imagen = :imagen,
      resumen = :resumen,
      descripcion = :descripcion
    WHERE slug = :slug
  `);
  query.run({ ...album, slug });
  return getBySlug(slug);
};

export const remove = (slug) => {
  const query = db.prepare("DELETE FROM albumes WHERE slug = ?");
  const result = query.run(slug);
  return result.changes > 0;
};
