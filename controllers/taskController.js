import taskModel from '../models/Task.js';
import validate from '../helpers/validate.js';

const test = (req, res) => {
    return res.status(200).send({
        status: 'Success',
        message: 'Ruta de prueba para Task'
    });
}

// Accion de crear task
const createTask = (req, res) => {

    // Obtener datos del usuario identificado
    const user = req.user;

    // Obtener datos del body
    const bodyData = req.body;

    // Comprobar que llegan bien
    if(!bodyData || bodyData.length == 0) return res.status(400).send({
        status: 'Error',
        message: 'Faltan datos por enviar'
    });

    // validar datos con validate
    if(!validate.Task(bodyData)) return res.status(400).send({
        status: 'Error',
        message: 'debe incluir al menos el titulo de la tarea (title) y el tipo de tarea (type: personal o work)'
    });

    bodyData.user = user.id;

    // hacer un create
    taskModel.create(bodyData)
        .then(createdTask => {
            if(!createdTask || createdTask.length == 0) return res.status(400).send({
                status: 'Error',
                message: 'No se pudo crear la tarea'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Tarea creada con exito',
                createdTask
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar crear la tarea'
            });
        });
}

// Accion de actualizar task
const update = (req, res) => {
    // Obtener datos del usuario identificado
    const user = req.user;

    // Obtener id de la task por url
    const taskId = req.params.id;

    // Obtener datos del body
    let bodyData = req.body;

    // hacer un findByIdAndUpdate
    taskModel.findOneAndUpdate({_id: taskId, user: user.id}, bodyData, {new: true}).exec()
        .then(updatedTask => {
            if(!updatedTask || updatedTask.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'Tarea no encontrada'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Tarea actualizada con exito',
                updatedTask
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar actualizar la tarea'
            });
        });
}

// Accion de eliminar task
const deleteTask = (req, res) => {
    // Obtener datos del usuario identificado
    const user = req.user;

    // Obtener id de la task por url
    const taskId = req.params.id;

    // hacer un findByIdAndUpdate
    taskModel.findOneAndUpdate({_id: taskId, user: user.id}, {active: false}, {new: true}).exec()
        .then(deletedTask => {
            if(!deletedTask || deletedTask.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'Tarea no encontrada'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Tarea Eliminada con exito',
                deletedTask
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar Eliminar la tarea'
            });
        });
}

// Accion de eliminar task by id
const deleteTaskById = (req, res) => {
    // Obtener id de la task por url
    const taskId = req.params.id;

    // hacer un findByIdAndUpdate
    taskModel.findOneAndUpdate({_id: taskId}, {active: false}, {new: true}).exec()
        .then(deletedTask => {
            if(!deletedTask || deletedTask.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'Tarea no encontrada'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Tarea Eliminada con exito',
                deletedTask
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar Eliminar la tarea'
            });
        });
}

// Accion de listar tareas
const listUserTasks = (req, res) => {

    // Obtener el id del usuario identificado
    const userId = req.user.id;

    // obtener el tipo de tareas por el url
    const type = req.params.type;

    // crear filtro de busqueda
    const filter = {
        user: userId,
        type,
        active: true
    }

    // hacer un find
    taskModel.find(filter).sort({created_at: -1}).exec()
        .then(tasks => {
            if(!tasks || tasks.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'No hay tareas aun'
            });

            return res.status(200).send({
                status: 'Success',
                message: `Lista de tareas del tipo ${type}`,
                tasks
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar listar las tareas'
            });
        });
}

// Accion de buscar tarea
const findTask = (req, res) => {
    // Obtener datos del usuario identificado
    let userId = req.user.id;

    // Obtener datos del body
    const bodyData = req.body;

    if(!bodyData.type || !bodyData.search) return res.status(400).send({
        status: 'Error',
        message: 'Debe indicar la busqueda y el tipo de tarea (personal o work)'
    });

    // crear regex
    const search = new RegExp(`${bodyData.search}`, 'i');

    // Hacer find con like
    taskModel.find({user: userId, type: bodyData.type, $or: [{title: search}, {description: search}]}).exec()
        .then(tasks => {
            if(!tasks || tasks.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'No se encontraron tareas que coincidan con su busqueda'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Busqueda exitosa',
                tasks
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar realizar la busqueda',
            });
        });
}

export {
    test,
    createTask,
    update,
    deleteTask,
    listUserTasks,
    findTask,
    deleteTaskById
}