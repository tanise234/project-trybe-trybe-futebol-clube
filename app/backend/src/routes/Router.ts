import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import TeamController from '../controllers/TeamController';
import MatchController from '../controllers/MatchController';
import { validateFields, validateToken } from '../middlewares/loginMiddleware';
import { validateTeams } from '../middlewares/matchMiddleware';

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
matchRouter.post('/matches', validateToken, validateTeams, matchController.matchInProgress);
matchRouter.patch('/matches/:id/finish', matchController.matchFinished);
matchRouter.patch('/matches/:id', matchController.matchUpdate);

export {
  loginRouter,
  teamRouter,
  matchRouter,
};
