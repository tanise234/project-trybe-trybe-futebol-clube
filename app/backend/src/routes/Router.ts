import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import TeamController from '../controllers/TeamController';
import MatchController from '../controllers/MatchController';
import { validateFields, validateToken } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const teamRouter = Router();
const matchRouter = Router();

const loginController = new LoginController();
const teamController = new TeamController();
const matchController = new MatchController();

loginRouter.post('/login', validateFields, loginController.verify);
loginRouter.get('/login/validate', validateToken, loginController.getRole);

teamRouter.get('/teams', teamController.getAll);
teamRouter.get('/teams/:id', teamController.getById);

matchRouter.get('/matches', matchController.getAll);
matchRouter.post('/matches', validateToken, matchController.matchInProgress);

export {
  loginRouter,
  teamRouter,
  matchRouter,
};
