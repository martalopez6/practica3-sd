// server.js
// Punto de entrada del microservicio Orchestrator

require("dotenv").config();
const express = require("express");

// Puerto configurado por variables de entorno
const PORT = process.env.PORT || 8080;

// Importación de las rutas del Orchestrator
const orchestratorRoutes = require("./routes/orchestatorRoutes");

const app = express();

// Permite al servidor entender datos JSON enviados por otros servicios o clientes
app.use(express.json());

// Registro de las rutas principales del Orchestrator
app.use("/", orchestratorRoutes);

// Arranque del servidor HTTP
app.listen(PORT, () => {
  console.log(`[ORCHESTRATOR] Servicio activo escuchando en el puerto ${PORT}`);
});
