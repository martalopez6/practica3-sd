'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema que define la estructura de los documentos Acquire en MongoDB
// Representa una ejecución del servicio Acquire
const AcquireSchema = new Schema({

  // Fecha de inicio del rango temporal utilizado para obtener datos de Kunna
  timeStart: {
    type: Date,
    required: true
  },

  // Fecha de fin del rango temporal utilizado para obtener datos de Kunna
  timeEnd: {
    type: Date,
    required: true
  },

  // Momento exacto en el que se realizó la petición al servicio Acquire
  // Se usa para trazabilidad y auditoría
  timeRequest: {
    type: Date,
    required: true
  },

  // Vector de features finales que se enviarán al modelo de predicción
  // Contiene los consumos históricos y las variables temporales
  features: {
    type: [Number],
    required: true
  }

});

// Exportación del modelo Acquire
// Mongoose crea automáticamente la colección correspondiente en MongoDB
module.exports = mongoose.model('Acquire', AcquireSchema);
