import * as albumes from "../../data/albumes.js";
import schema from "./search.schema.js";

const DEFAULT = "Busqueda invalida";

export const search = (req, res) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const result = albumes.search(parsed.data.text);
  res.json(result.map((item) => item.slug));
};
