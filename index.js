'use strict'

// importamos la librería mongoose
var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

// desactivar métodos viejos que pueden generar conflicto
mongoose.set('useFindAndModify',false);

// configurar mongoos para ejecutar promesas:
mongoose.Promise = global.Promise;

// conexión a mongodb:
//NOTA: Aquí hay que poner la cadena de conexión que CADA CUAL configura en su MongoDB Atlas!!!!
mongoose.connect("mongodb+srv://david:12345@cluster0-bwg2g.mongodb.net/test?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("La conexión con la base de datos se hizo correctamente");

    app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:3900");
    })

});
