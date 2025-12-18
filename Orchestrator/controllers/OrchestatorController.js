// Controlador del microservicio Orchestrator

// Endpoint de comprobación del estado del servicio
function health(req, res) {
  res.json({
    status: "ok",
    service: "orchestrator"
  });
}

// Endpoint principal que coordina Acquire y Predict
async function run(req, res) {

  // URL interna del microservicio Acquire (red de Docker)
  const acquireUrl = "http://acquire-service:3001/data";

  // Llamada al servicio Acquire para obtener los datos de entrada
  const acquireResponse = await fetch(acquireUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Control de error si Acquire no responde correctamente
  if (!acquireResponse.ok) {
    return res.status(500).json({
      error: `Error al comunicarse con el servicio Acquire: ${acquireResponse.statusText}`
    });
  }

  // Lectura de la respuesta de Acquire
  const acquireJson = await acquireResponse.json();
  const acquireId = acquireJson.id;
  const acquireFeatures = acquireJson.features;

  // Cuerpo de la petición que se enviará al servicio Predict
  const predictBody = {
    features: acquireFeatures,
    meta: {
      featureCount: 7 // Número de features que espera el modelo
    }
  };

  // URL interna del microservicio Predict
  const predictUrl = "http://predict-service:3002/predict";

  // Llamada al servicio Predict para ejecutar la predicción
  const predictResponse = await fetch(predictUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(predictBody)
  });

  // Control de error si Predict falla
  if (!predictResponse.ok) {
    return res.status(500).json({
      error: `Error al comunicarse con el servicio Predict: ${predictResponse.statusText}`
    });
  }

  // Lectura del resultado de la predicción
  const predictJson = await predictResponse.json();
  const predictionId = predictJson.predictionId;
  const prediction = predictJson.prediction;
  const timestamp = predictJson.timestamp;

  // Respuesta final al cliente con la información agregada
  res.status(200).json({
    dataId: acquireId,
    predictionId,
    prediction,
    timestamp
  });
}

module.exports = {
  health,
  run
};
