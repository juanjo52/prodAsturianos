const mongoose = require('mongoose');

let comentarioSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    comentario: {
        type: String,
        required: true,
        minlength: 5
    }
});

let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        min: 0
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    },
    comentarios : [comentarioSchema]
});

let Producto = mongoose.model('producto', productoSchema);

module.exports = Producto;

