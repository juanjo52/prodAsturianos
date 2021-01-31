const express = require('express');
const multer = require('multer');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let upload = multer({storage: storage});

//Raíz de la aplicación
router.get('/', (req, res) => {
    Producto.find().then(resultado => {
        res.render('publico_index', { ok: true, productos: resultado});
    }).catch (error => {
        res.render('publico_error', {ok: false})
    }); 
});

//Buscará roductos cuto nombre se le pase en el cuerpo de la petición
router.post('/buscar', (req, res) => {
    let contenido = req.body.contenido;
    Producto.find().then(resultado => {
        let productosBusqueda = [];

        resultado.forEach(producto => {
            if((producto.nombre.toLowerCase()).includes(contenido.toLowerCase())){
                productosBusqueda.push(producto);
            }
        });
        res.render('publico_index', {ok: true, productos: productosBusqueda});
    }).catch (error => {
        res.render('publico_error', {ok: false, error: "No se encontraron productos"});
    });
});

//Renderizará la vista del producto que contenga el id que se le pase como parámetro
router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado =>{
        res.render('publico_producto', {ok:true, producto:resultado})
    }).catch(error => {
        res.render('publico_error', {ok:false, error:"Producto no encontrado"})
    })
});

module.exports = router;