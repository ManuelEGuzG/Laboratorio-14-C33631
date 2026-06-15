import { z } from "zod";

const schema = z.object({
  text: z.string()
    .trim()
    .nonempty("La busqueda no puede estar vacia")
    .min(3, "La busqueda debe tener al menos 3 caracteres")
    .max(100, "La busqueda no puede tener mas de 100 caracteres")
    .transform((value) => value.toLowerCase())
});

export default schema;
