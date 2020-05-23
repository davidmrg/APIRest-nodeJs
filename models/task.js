'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //variable para usar el objeto Schema

//se define la estructura de los objetos y documentos que estaré guardando y usando. 
//Se definen propiedades del objeto

var taskSchema = Schema({ 
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});

//para poder usar el modelo hay q exportarlo como un módulo para que desps pueda usarlo
// (por ejemplo: conectarme a la bdd usándolo)

module.exports = mongoose.model('Task',taskSchema);


