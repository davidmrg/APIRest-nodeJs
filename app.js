'use strict'

// cargar los modulos de node para ejecutar el servidor
var express = require('express');
var bodyParser = require('body-parser');

//ejecutar Express
var app = express();

// cargamos rutas 
var articleRoutes = require('./routes/task');

// middlewares
app.use(bodyParser.urlencoded({extended: false})); //permite cargar bodyparser
app.use(bodyParser.json()); //convierte peticiones http a json


// CORS: Es el acceso cruzado entre dominio: "Cross-origin resource sharing"
// permite llamadas http desde cualquier front end que pueda existir en otra ip
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//añadimos prefijos de rutas o cargar rutas
app.use('/api',articleRoutes);


/* 
// ejemplo prefijo devolviendo contenido estático html
app.get('/prueba',(req, res) =>{
    //console.log("hola mundo");
    return res.status(200).send(`
    <h1>Hola Mundo</h1>
    <h2>Este es un contenido estático en una ruta establecida desde Node.Js</h2>
    `);
});
 */
// Ejemplo prefijo de ruta devolviendo objeto JSON:
/* app.post('/tareas',(req, res) =>{
    //console.log("hola mundo");
    return res.status(200).send({
        tareaTitulo: 'Proyecto de Hipermedia',
        descripcion: 'Proyecto de corte 3',
        estado: 'pendiente' 
    });
});
 */

// exportación de módulo
module.exports = app;
