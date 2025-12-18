const Acquire = require("../models/Acquire");

// Endpoint de comprobación de estado del servicio
function health(req, res) {
  res.json({
    status: "ok",
    service: "acquire"
  });
}

async function data(req, res) {

  // Configuración de acceso a la API de Kunna
  const KUNNA_URL = "https://openapi.kunna.es/data/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjM2NDEwNjB9.ixb4O5Jgk-e_oPMSsycpD7A_iGVqIl4Ijl2a_kLrT94";
  const ALIAS = "6339651";

  // Momento exacto en el que se recibe la petición
  const currentTime = new Date();

  // Constante con los milisegundos que tiene un día
  const DAY_MS = 24 * 60 * 60 * 1000;

  let timeStart;
  let timeEnd;

  // Decisión del rango temporal según la hora actual
  // Si estamos en la última hora del día, se considera el día prácticamente cerrado
  if (currentTime.getHours() === 23) {
    timeEnd = new Date(currentTime.getTime());
    timeStart = new Date(currentTime.getTime() - 3 * DAY_MS);
  } else {
    // En el resto de casos se usan solo días completamente cerrados
    timeEnd = new Date(currentTime.getTime() - DAY_MS);
    timeStart = new Date(currentTime.getTime() - 4 * DAY_MS);
  }

  // Función auxiliar para obtener los datos de Kunna
  async function fetchKunna(timeStart, timeEnd) {

    const body = {
      time_start: timeStart.toISOString(), // Conversión al formato esperado por Kunna
      time_end: timeEnd.toISOString(),
      filters: [
        { filter: "name", values: ["1d"] },   // Agregación diaria
        { filter: "alias", values: [ALIAS] } // Contador concreto
      ],
      limit: 100,
      count: false,
      order: "DESC" // Datos ordenados del más reciente al más antiguo
    };

    // Petición HTTP a la API externa
    const response = await fetch(KUNNA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // Control básico de errores de red
    if (!response.ok) {
      return res.status(500).json({
        error: `Error al conectarse a Kunna: ${response.statusText}`
      });
    }

    const json = await response.json();
    const result = json.result;

    // Validación mínima de la respuesta recibida
    if (!result || !Array.isArray(result.columns) || !Array.isArray(result.values)) {
      return res.status(500).json({
        error: "Respuesta inválida de Kunna"
      });
    }

    return result;
  }

  // Obtención de los datos históricos
  const result = await fetchKunna(timeStart, timeEnd);
  const values = result.values;

  // Variables temporales que se usarán como features
  const hour = currentTime.getHours();
  const weekDay = (currentTime.getDay() + 6) % 7; // Lunes = 0, Domingo = 6
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1;       // Mes en rango 1–12

  // Vector final de features que consumirá el modelo
  const features = [
    values[0][2], // consumo del día más reciente
    values[1][2], // consumo del día anterior
    values[2][2], // consumo del día anterior al anterior
    hour,
    weekDay,
    month,
    day
  ];

  // Marca temporal de la petición (trazabilidad)
  const requestTimestamp = currentTime.toISOString();

  // Creación del documento Acquire en memoria
  const newAcquire = new Acquire({
    timeStart,
    timeEnd,
    timeRequest: requestTimestamp,
    features
  });

  // Persistencia del input de la predicción en MongoDB
  await newAcquire.save();

  // Respuesta al cliente una vez confirmado el guardado
  res.status(200).json({
    id: newAcquire._id,
    features
  });
}

module.exports = {
  health,
  data
};
