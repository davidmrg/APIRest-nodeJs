'use strict'
var validator = require('validator');
var fs = require('fs');
var path = require ('path');

var Tarea = require('../models/task'); 

//se define objeto con funciones y métodos adentro
var controller = {
        //método 1 (callback)
        datosCurso: (req, res) =>{
            //console.log("hola mundo");
            return res.status(200).send({
                tareaTitulo: 'Proyecto de Hipermedia',
                descripcion: 'Proyecto de corte 3',
                estado: 'pendiente' 
            });
        },
        //método 2 (callback)
        test: (req, res) =>{
            return res.status(200).send({
                mensaje: 'Soy un método test'
            });
        },
        //método (callback) save:
        save: (req, res) =>{

            //Recibir parámetros por post 
            var params = req.body;
            //validar datos con validator
            try{
                var validateTitle = !validator.isEmpty(params.title);
                var validateContent = !validator.isEmpty(params.content);
            }catch(err){
                return res.status(200).send({
                    status: 'error',      
                    message: 'faltan datos por enviar'
                });
            }
            if(validateTitle && validateContent){
            
            //crear objeto a guardar (tarea)
            var tarea = new Tarea(); //instanciamos obj creado en el modelo
            
            //asignar valores
            tarea.title = params.title; //valores desde el obj tarea
            tarea.content = params.content;
            tarea.image = null;
            
            //guardar la tarea
            tarea.save((err, tareaGuardada) => {
                if(err || !tareaGuardada){
                    return res.status(404).send({
                        status: 'error', //agregamos esta propiedad para complementar msg
                        message: 'Tarea no guardada'
                    });
                }

                //devolver una respuesta
                return res.status(200).send({
                status: 'success',
                tarea: tareaGuardada
                });

            });

            
            }else{
                return res.status(200).send({
                    status: 'error', //agregamos esta propiedad para complementar msg
                    message: 'datos no son validos'
                });
            }
        },
        //método para obtener tareas de la bdd
        getTasks: (req, res) => {

            var query = Tarea.find({}); //query para hacer un find en todos los docs

            //lógica para últimas tareas:
           
            //implementamos Find con limit
            query.limit(5).sort('-_id').exec((err, tareas)=>{

                if(err){
                    return res.status(500).send({
                        status: 'error', 
                        message: 'Error al leer las tareas'
                    });
                }

                if(!tareas){
                    return res.status(404).send({
                        status: 'error', 
                        message: 'No hay tareas para mostrar'
                    });
                }

                return res.status(200).send({
                    status: 'success', 
                    message: tareas
                });
            });   
        },
        //método para obtener una sola tarea
        getOneTask: (req, res) => {
            
            // obtener el id de la url
            var tareaId = req.params.id;
            console.log(tareaId); 

            // comprobar si existe (si es != null)
            if (!tareaId || tareaId == null){
                return res.status(404).send({
                    status: 'error', 
                    message: 'No existe la tarea'
                });
            }
            //buscar la tarea
            Tarea.findById(tareaId, (err, tarea) => {
                
                if(err || !tarea){
                    return res.status(404).send({
                        status: 'error', 
                        message: 'No se encuentra la tarea en el servidor'
                    });
                }
                // devolver la tarea en json       
                return res.status(404).send({
                    status: 'Success', 
                    tarea
                });

            });
           
        },
        //método para actualizar los datos
        update: (req, res) => {
            //Obtener id de tarea por URL
            var tareaUpdateId = req.params.id;

            //Obtener datos que llegan por put
            var params = req.body; //se obtiene todo el body de la petición que llegue

            //Validar datos
            try {   
                var validate_title = !validator.isEmpty(params.title); //cuando params.title no esté vacio, es true
                var validate_content =!validator.isEmpty(params.content)//cuando params.content no esté vacio, es true
            } catch (error) {
                return res.status(200).send({
                    status: 'error', 
                    message: 'Datos insuficientes'
                });
            }

            if(validate_title && validate_content){
                //Find & Update
                Tarea.findOneAndUpdate({_id: tareaUpdateId}, params, {new:true}, (err, tareaUpdated) => {
                    if(err){
                        return res.status(500).send({
                            status: 'error', 
                            message: 'Error al actualizar'
                        });
                    }
                    if(!tareaUpdated){
                        return res.status(404).send({
                            status: 'error', 
                            message: 'No existe tarea'
                        });
                    }
                    //si no entra a ninguna de las condiciones
                    return res.status(200).send({
                        status: 'success', 
                        tarea: tareaUpdated
                    });

                }); //el parametro {new:true} permite devolver el obj que estoy actualizando ya actualizado
                }else{
                //devolver respuesta JSON
                return res.status(200).send({
                    status: 'error', 
                    message: 'Validación incorrecta'
                });
            }  
        },
        //Metodo para borrar datos
        delete: (req, res) => {

            //obtener el id de la url
            var tareaDeleteId = req.params.id;
            //find & delete
            Tarea.findOneAndDelete({_id: tareaDeleteId}, (err, tareaBorrada) => {
                if(err){
                    return res.status(500).send({
                        status: 'error', 
                        message: 'Error al borrar el dato'
                    });
                }

                if(!tareaBorrada){
                    return res.status(404).send({
                        status: 'error', 
                        message: 'No se borró la tarea por que no se encontró'
                    });
                }

                return res.status(200).send({
                    status: 'Success', 
                    tarea: tareaBorrada 
                });

            });
            
        },

        //metodo para subir tareas
        upload: (req, res) => {
            
            //configurar el connect multiparty en router/task.js (LISTO!)

            //recojer el archivo de la petición
            var nombre_file = 'Imagen no guardada';
            //console.log(req.files);

            if(!req.files){
                return res.status(404).send({
                    status: 'error',
                    message: nombre_file
                });
            }
            //obtener nombre y extensión del archivo
            var file_path = req.files.file0.path; //captura el atributo path del json de la imagen
            var file_split = file_path.split('/');
            //nombre del archivo:
            var file_name = file_split[2];
            //obtener extensión del archivo:
            var ext_split = file_name.split('.');
            var file_ext = ext_split[1];
            //comprobar la extensión, (solo imagenes)
            if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' && file_ext != 'jpg'){
                // borrar
                fs.unlink(file_path,(err)=>{
                    return res.status(200).send({
                        status: 'error',
                        message: 'La extensión del archivo no es válida'
                    });
                });
            }else{
                // si todo es válido 
                //busar la tarea, asignar el nombre de la imagen y actualizar
                var tareaId = req.params.id; //extraemos id de url
                Tarea.findOneAndUpdate({_id: tareaId}, {image: file_name}, {new: true}, (err, tareaUpdated)=>{
                    if(err || !tareaUpdated){
                        return res.status(200).send({
                            status: 'success',
                            message: 'error al guardar la imagen del artículo'
                        });
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        task: tareaUpdated
                    });
                });

            }
            
        },
        //método para obtener una imagen de la API (backend)
        getImage: (req, res) => {

            var file = req.params.image; 
            var path_file = './upload/tareas/'+file;

            //confirmar si el file existe:
            fs.exists(path_file, (exists)=>{
                if(exists){
                    return res.sendFile(path.resolve(path_file));
                }else{
                    return res.status(404).send({
                        status: 'error',
                        message: 'la imagen no existe'
                    });
                }
            });
           
        },
        //método para buscar tareas
        search: (req, res) => {
            var searchString = req.params.search;
            //obtener el string buscado
           Tarea.find({"$or":[  //operador $or de mongoose. los parámetros van dentro de un array[]
                //si el searchString está incluido dentro del title $or si está incluido "i" dentro del content:
                { "title": { "$regex": searchString, "$options": "i" }},
                { "content": { "$regex": searchString, "$options": "i" }}
           ]})
           .sort([['descending']])
           .exec((err, tareas)=>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la petición'
                });
            }

            if(!tareas || tareas.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'no se encuentran tareas'
                });
            }

            return res.status(200).send({
                status: 'success',
                tareas
            });
           }); 
        }
    }; //fin controller
    
//para poder usar (devolver) los métodos dentro del archivo de rutas.
module.exports = controller;



