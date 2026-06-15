import { z } from "zod";

const schema = z.object({
  titulo: z.string().trim().nonempty("El titulo es requerido").max(200),
  artista: z.string().trim().nonempty("El artista es requerido").max(200),
  genero: z.string().trim().nonempty("El genero es requerido").max(100),
  anio: z.number().int().min(1900, "El anio debe ser mayor a 1900").max(2100, "El anio debe ser menor a 2100"),
  sello: z.string().trim().nonempty("El sello es requerido").max(200),
  pistas: z.number().int().min(1, "Debe tener al menos 1 pista").max(100),
  imagen: z.string().trim().nonempty("La imagen es requerida").max(200),
  slug: z.string().trim()
    .nonempty("El slug es requerido")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minusculas, numeros y guiones"),
  resumen: z.string().trim().nonempty("El resumen es requerido").max(500),
  descripcion: z.string().trim().nonempty("La descripcion es requerida").max(2000)
});

export default schema;
