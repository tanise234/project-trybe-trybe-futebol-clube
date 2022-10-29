import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import { validateFields, validateToken } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const loginController = new LoginController();
const matchRouter = Router();

loginRouter.post('/login', validateFields, loginController.verify);
loginRouter.get('/login/validate', validateToken);

export {
  loginRouter,
  matchRouter,
};
