import { env, loadEnvFile } from "node:process";
import app from "./app.js";

loadEnvFile("./.env");

const { HOST, PORT } = env;

app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando: http://${HOST}:${PORT}`);
});