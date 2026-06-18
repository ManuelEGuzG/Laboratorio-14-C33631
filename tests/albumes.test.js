import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";
import app from "../app.js";

const SLUG_EXISTENTE = "thriller";
const SLUG_INEXISTENTE = "album-que-no-existe";
const SLUG_NUEVO = "ok-computer-test";

const ALBUM_VALIDO = {
  titulo: "OK Computer",
  artista: "Radiohead",
  genero: "Rock Alternativo",
  anio: 1997,
  sello: "Parlophone",
  pistas: 12,
  imagen: "ok-computer.avif",
  slug: SLUG_NUEVO,
  resumen: "Obra maestra del rock alternativo.",
  descripcion: "Tercer album de Radiohead que combina rock alternativo con elementos electronicos."
};

beforeAll(() => {
  const db = new DatabaseSync(`${cwd()}/data/albumes.db`);
  db.exec(`DELETE FROM albumes WHERE slug = '${SLUG_NUEVO}'`);
  db.close();
});

afterAll(() => {
  const db = new DatabaseSync(`${cwd()}/data/albumes.db`);
  db.exec(`DELETE FROM albumes WHERE slug = '${SLUG_NUEVO}'`);
  db.close();
});

describe("GET /albumes", () => {
  it("200 y devuelve un arreglo que contiene un slug sembrado", async () => {
    const res = await request(app).get("/albumes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain(SLUG_EXISTENTE);
  });
});

describe("GET /album/:slug", () => {
  it("200 y devuelve el objeto del album cuando el slug existe", async () => {
    const res = await request(app).get(`/album/${SLUG_EXISTENTE}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      slug: SLUG_EXISTENTE,
      titulo: expect.any(String),
      artista: expect.any(String)
    });
  });

  it("404 en JSON cuando el slug no existe", async () => {
    const res = await request(app).get(`/album/${SLUG_INEXISTENTE}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /search/:text", () => {
  it("400 en JSON cuando el texto tiene menos de 3 caracteres", async () => {
    const res = await request(app).get("/search/ab");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("200 y devuelve arreglo cuando el texto es valido", async () => {
    const res = await request(app).get("/search/rock");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /albumes", () => {
  it("201, cabecera Location y objeto creado con cuerpo valido", async () => {
    const res = await request(app).post("/albumes").send(ALBUM_VALIDO);
    expect(res.status).toBe(201);
    expect(res.headers).toHaveProperty("location");
    expect(res.body).toMatchObject({ slug: SLUG_NUEVO });
  });

  it("400 en JSON cuando el cuerpo es invalido", async () => {
    const res = await request(app).post("/albumes").send({ titulo: "Incompleto" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("409 en JSON cuando el slug ya existe", async () => {
    const res = await request(app).post("/albumes").send({ ...ALBUM_VALIDO });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });
});

describe("PUT /album/:slug", () => {
  it("200 y objeto actualizado cuando existe y el cuerpo es valido", async () => {
    const res = await request(app).put(`/album/${SLUG_NUEVO}`).send({ ...ALBUM_VALIDO, resumen: "Actualizado." });
    expect(res.status).toBe(200);
    expect(res.body.resumen).toBe("Actualizado.");
  });

  it("404 en JSON cuando el slug no existe", async () => {
    const res = await request(app).put(`/album/${SLUG_INEXISTENTE}`).send(ALBUM_VALIDO);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("DELETE /album/:slug", () => {
  it("204 sin cuerpo cuando el album existe", async () => {
    const res = await request(app).delete(`/album/${SLUG_NUEVO}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it("404 en JSON cuando el slug no existe", async () => {
    const res = await request(app).delete(`/album/${SLUG_INEXISTENTE}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});