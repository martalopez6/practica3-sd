// server.js
// Punto de arranque del microservicio Acquire

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const acquireRoutes = require("./routes/predictRoutes");

// Variables de entorno
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Conexión con la base de datos MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("[ACQUIRE] Conexión con MongoDB establecida correctamente");
  })
  .catch((err) => {
    console.error("[ACQUIRE] Error al conectar con MongoDB", err);
  });

// Permite leer datos JSON enviados en las peticiones HTTP
app.use(express.json());

// Rutas principales del servicio Acquire
app.use("/", acquireRoutes);

// Arranque del servidor HTTP
app.listen(PORT, () => {
  console.log(`[ACQUIRE] Servicio escuchando en el puerto ${PORT}`);
});
