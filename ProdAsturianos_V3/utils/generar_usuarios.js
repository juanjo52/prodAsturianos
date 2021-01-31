const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'password1';
const myPlaintextPassword2 = 'password2';
mongoose.connect('mongodb://localhost:27017/prodAsturianosV3',{useNewUrlParser: true, useUnifiedTopology:true});
Usuario.collection.drop();


bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    let usu1 = new Usuario({
        nickname: 'juanjo',
        password: hash
       });
       usu1.save();
});

bcrypt.hash(myPlaintextPassword2, saltRounds, function(err, hash) {
    let usu2 = new Usuario({
        nickname: 'nacho',
        password: hash
       });
       usu2.save();
});

