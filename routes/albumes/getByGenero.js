import * as albumes from "../../data/albumes.js";
import { z } from "zod";

const schema = z.object({
  genero: z.string()
    .trim()
    .nonempty("El genero no puede estar vacio")
    .min(2, "El genero debe tener al menos 2 caracteres")
    .max(100, "El genero no puede tener mas de 100 caracteres")
});

const DEFAULT = "Genero invalido";

export const getByGenero = (req, res) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? DEFAULT;
    return res.status(400).json({ error });
  }

  const result = albumes.getByGenero(parsed.data.genero);
  res.json(result.map((item) => item.slug));
};
