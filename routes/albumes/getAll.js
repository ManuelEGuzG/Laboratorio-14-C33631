import * as albumes from "../../data/albumes.js";

export const getAll = (req, res) => {
  const result = albumes.getAll().map((item) => item.slug);
  res.json(result);
};
