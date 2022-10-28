import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import { fisrtValidation } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const loginController = new LoginController();
const matchRouter = Router();

loginRouter.post('/login', fisrtValidation, loginController.verify);

export {
  loginRouter,
  matchRouter,
};
