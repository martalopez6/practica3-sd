// server.js
// Punto de entrada del microservicio PREDICT

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const predictRoutes = require("./routes/predictRoutes");
const { initModel } = require("./services/tfModelService");

// Configuración básica del servicio
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Exponer el modelo TensorFlow.js como recurso estático
// (model.json + archivos .bin)
const modelPath = path.resolve(__dirname, "model");
app.use("/model", express.static(modelPath));

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("[PREDICT] Conectado correctamente a MongoDB");
  })
  .catch((err) => {
    console.error("[PREDICT] Error al conectar con MongoDB:", err);
  });

// Registro de rutas del servicio
app.use("/", predictRoutes);

// Arranque del servidor y carga inicial del modelo
app.listen(PORT, async () => {
  const serviceUrl = `http://localhost:${PORT}`;
  console.log(`[PREDICT] Servicio activo en ${serviceUrl}`);

  try {
    // Carga del modelo en memoria al iniciar el servicio
    await initModel(serviceUrl);
    console.log("[PREDICT] Modelo cargado correctamente");
  } catch (err) {
    console.error("[PREDICT] Error al inicializar el modelo:", err);
    process.exit(1);
  }
});
