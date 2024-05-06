import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

// Crear el router
const taskRouter = new Router();

// Rutas
taskRouter.get('/test', taskController.test);
taskRouter.post('/create', auth, taskController.createTask);
taskRouter.put('/update/:id?', auth, taskController.update);
taskRouter.delete('/delete/:id?', auth, taskController.deleteTask);
taskRouter.get('/list/:type?', auth, taskController.listUserTasks);
taskRouter.get('/search', auth, taskController.findTask);

// Exportar rutas
export default taskRouter;