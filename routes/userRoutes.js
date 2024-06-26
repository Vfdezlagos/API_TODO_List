import { Router } from 'express';
import auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';
import authMailer from '../middlewares/authMailer.js';

// Crear el router
const userRouter = Router();

// Rutas
userRouter.get('/test', userController.test);

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.put('/update', auth, userController.update);
userRouter.delete('/delete', auth, userController.deleteUser);
userRouter.post('/passwordRecovery', userController.passwordRecovery);
userRouter.patch('/passwordChange', auth, userController.passwordChange);


// Exportar rutas
export default userRouter;
