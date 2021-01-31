const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    nickname: {
        type: String,
        minlength: 5,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;