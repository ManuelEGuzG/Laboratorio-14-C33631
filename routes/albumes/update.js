import * as albumes from "../../data/albumes.js";
import schema from "./album.schema.js";
import slugSchema from "./slug.schema.js";

const DEFAULT = "Datos invalidos";

export const update = (req, res) => {
  const parsedSlug = slugSchema.safeParse(req.params);

  if (!parsedSlug.success) {
    const error = parsedSlug.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const existing = albumes.getBySlug(parsedSlug.data.slug);
  if (!existing) {
    return res.status(404).json({ error: "Album no encontrado" });
  }

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const result = albumes.update(parsedSlug.data.slug, parsed.data);
  res.json(result);
};
