const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nombre: { type: String },
  edad: { type: String },
});

const Estudiantes = mongoose.model('Estudiantes', schema);

module.exports = Estudiantes;
