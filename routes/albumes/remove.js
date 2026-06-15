import * as albumes from "../../data/albumes.js";
import schema from "./slug.schema.js";

const DEFAULT = "Slug invalido";

export const remove = (req, res) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const existing = albumes.getBySlug(parsed.data.slug);
  if (!existing) {
    return res.status(404).json({ error: "Album no encontrado" });
  }

  albumes.remove(parsed.data.slug);
  res.status(204).send();
};
