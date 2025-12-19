'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Esquema que define la estructura de los documentos predict en MongoDB
// Representa una ejecución del servicio predict
const Prediction = new Schema({
    prediction : {type:Number, required: true},
    fecha : {type: Date, default: Date.now},
    features : { type: [Number]},
}
)
// Exportación del modelo Predition
// Mongoose crea automáticamente la colección correspondiente en MongoDB
module.exports = mongoose.model('Prediction', Prediction)


