import { z } from "zod";

const schema = z.object({
  slug: z.string()
    .trim()
    .nonempty("El slug no puede estar vacio")
    .min(1, "El slug debe tener al menos 1 caracter")
    .max(100, "El slug no puede tener mas de 100 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minusculas, numeros y guiones")
});

export default schema;
