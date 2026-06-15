import * as albumes from "../../data/albumes.js";
import schema from "./album.schema.js";

const DEFAULT = "Datos invalidos";

export const create = (req, res) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const existing = albumes.getBySlug(parsed.data.slug);
  if (existing) {
    return res.status(409).json({ error: "Ya existe un album con ese slug" });
  }

  const result = albumes.create(parsed.data);
  res.status(201).set("Location", `/album/${result.slug}`).json(result);
};
