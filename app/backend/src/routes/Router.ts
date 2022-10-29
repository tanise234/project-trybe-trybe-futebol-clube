import { Router } from 'express';
import TeamController from '../controllers/TeamController';
import LoginController from '../controllers/LoginController';
import { validateFields, validateToken } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const teamRouter = Router();

const loginController = new LoginController();
const teamController = new TeamController();

loginRouter.post('/login', validateFields, loginController.verify);
loginRouter.get('/login/validate', validateToken, loginController.getRole);

teamRouter.get('/teams', teamController.getAll);
teamRouter.get('/teams/:id', teamController.getById);

const matchRouter = Router();
export {
  loginRouter,
  teamRouter,
  matchRouter,
};
