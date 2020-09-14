const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let categoriaShema = new mongoose.Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripcion es obligatoria'] },
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
});

module.exports = mongoose.model('Categoria', categoriaShema);