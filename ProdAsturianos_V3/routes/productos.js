const express = require('express');
const multer = require('multer');
const utils = require(__dirname+'/../utils/auth.js')


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

// Servicios 
router.get('/', utils.autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { ok: true, productos: resultado});
    }).catch (error => {
        res.render('admin_error', {ok: false})
    }); 
});

router.get('/nuevo', utils.autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

router.get('/editar/:id', utils.autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        res.render('admin_productos_form', {ok:true, producto:resultado})
    }).catch(error =>{
        res.render('admin_error', {ok:false, error:"Producto no encontrado"})
    });
});

router.post('/', utils.autenticacion, upload.single('imagen'), (req, res) => {

    let img = req.file === undefined?'':req.file.filename;

    if(img === ''){
        res.render('admin_error',{ok:false});
    }else{
        let nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            imagen: req.file.filename
        });
        nuevoProducto.save().then(resultado =>{
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error',{ok:false});
        });
    }

    
});

//Servicio editar productos
router.post('/:id', utils.autenticacion, upload.single('imagen'), (req, res) => {

    let img = req.file === undefined?'':req.file.filename;

    if(img === ''){
        imagen = Producto.findById(req.params.id).then(resultado => {
            img = resultado.imagen;

            Producto.findByIdAndUpdate(req.params.id, {
                $set: {
                    nombre: req.body.nombre,
                    precio: req.body.precio,
                    descripcion: req.body.descripcion,
                    imagen: img
                }
            }, {new: true}).then(resultado => {
                res.redirect(req.baseUrl);
            }).catch(error => {
                res.render('admin_error',{ok:false});
            });
        });
    }
    else{
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: img
            }
        }, {new: true}).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error',{ok:false});
        }); 
    }
});

router.delete('/:id', utils.autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error', {ok:false});
    });
});

//Renderizado vista formulario de añadir comentario
router.get('/comentarios/nuevo/:id', utils.autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        res.render('admin_comentarios', {ok:true, producto:resultado})
    }).catch(error =>{
        res.render('admin_error', {ok:false, error:"Producto no encontrado"})
    });
});

//Servicio para añadir comentarios
router.post('/comentarios/:id', (req, res) => {

    Producto.findById(req.params.id).then(resultado=>{ 
        resultado.comentarios.push({nickname:req.session.usuario,comentario:req.body.comentario});  
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                comentarios: resultado.comentarios
            }
        }, {new: true}).then(resultado => {
            if (resultado){
                res.render('publico_producto',{ok: true, producto: resultado});
            }    
            else
                res.render('admin_error',{ok: false, error: "Producto no encontrado"});
        }).catch(error => {
            res.render('admin_error', {ok: false, error:"Error modificando los comentarios del producto"});
        });    
    }).catch(error => {
        res.render('admin_error', {ok: false, error:"Error modificando los comentarios del producto"});
    });

});

//Servicio para borrar comentarios
router.delete('/comentarios/:idProducto/:idComentario', (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado => {
        resultado.comentarios.forEach(element => {
            if(element.id === req.params.idComentario){
                if(element.nickname === req.session.usuario){
                    resultado.comentarios = resultado.comentarios.filter(comentario => comentario.id !== req.params.idComentario);
                    Producto.findByIdAndUpdate(req.params.idProducto, {
                        $set: {
                            comentarios: resultado.comentarios
                        }
                    }, {new: true}).then(resultado => {
                        if (resultado)
                            res.render('publico_producto',{ok: true, producto: resultado});
                        else
                            res.render('admin_error',{ok: false, error: "Producto no encontrado"});
                    }).catch(error => {
                        res.render('admin_error',{ok: false, error:"Error eliminando comentario"});
                    });   
                }
                else{
                    res.render('admin_error',{ok:false, error:"No tienes permisos para eliminar este comentario"});
                }
            }
        });
    }).catch (error => {
        res.render('admin_error',{ ok: false, error: "Producto no encontrado"});
    }); 
});

module.exports = router;