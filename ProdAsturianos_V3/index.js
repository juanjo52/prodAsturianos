//Carga librerias
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');


//Carga enrutadores
const productos = require(__dirname + '/routes/productos');
const publico = require(__dirname + '/routes/publico');
const auth = require(__dirname + '/routes/auth');

//Conexion con bbdd
mongoose.connect('mongodb://localhost:27017/prodAsturianosV3', {useNewUrlParser: true, useUnifiedTopology:true});

//Inicializar express
let app = express();

// Configurar motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

//Configuración de la sesión de la aplicación
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', publico);
app.use('/admin', productos);
app.use('/auth', auth);


//Pues en marcha de servidor
app.listen(8080);
