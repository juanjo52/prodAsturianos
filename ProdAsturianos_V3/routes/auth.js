const express = require('express');
const { route } = require('./productos');
const bcrypt = require('bcrypt');

let Usuario = require(__dirname + '/../models/usuario.js');
let router = express.Router();

//Servicios

router.get('/login', (req, res) => {
    res.render('auth_login');
});

router.post('/login', (req, res) => {
    let nickname = req.body.nickname;
    let password = req.body.password;

    Usuario.findOne({nickname:nickname}).then(resultado => {
        bcrypt.compare(password, resultado.password, function(err, result){
            if(result){
                req.session.usuario = resultado.nickname;
                res.redirect('/admin/');
            }
            else{
                res.render('auth_login', {error: "Usuario o contraseña incorrectos"});
            }
        })
    }).catch (error => {
        res.render('auth_login', {error: "Usuario o contraseña incorrectos"});
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;