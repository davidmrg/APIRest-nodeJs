'use strict'
var express = require('express'); //para poder usar las rutas de express
var TaskController = require('../controllers/task'); 
//cargar el controlador que creamos en carpeta controllers

var router = express.Router(); //llamar al router de Express

var multipart = require('connect-multiparty'); //para poder usar el modulo multiparty
var md_upload = multipart({uploadDir: './upload/tareas'});

//ahora se pueden crear las rutas. metodo get o post
//rutas de PRUEBA:
router.post('/datos-curso', TaskController.datosCurso);
router.get('/test-de-controlador', TaskController.test);

//rutas para el proyecto:
router.post('/save', TaskController.save);//usamos post para guardar o enviar cosas a la bdd
router.get('/tasks/', TaskController.getTasks);//usamos get para sacar datos de la bdd
router.get('/onetask/:id', TaskController.getOneTask);
router.put('/onetask/:id', TaskController.update);//usamos método put que es para actualizar
router.delete('/onetask/:id', TaskController.delete);//usamos método delete que es para borrar
router.post('/upload-image/:id', md_upload, TaskController.upload); //usamos post para guardar o enviar cosas a la bdd
router.get('/get-image/:image', TaskController.getImage);
router.get('/search/:search', TaskController.search);


//exportar el módulo para poder usarlo en cualquier otra parte (ejemplo, en app.js)
module.exports = router;
