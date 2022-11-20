import { Router } from 'express';
import UserController from '../controllers/UserController';
import TeamController from '../controllers/TeamController';
import MatchController from '../controllers/MatchController';
import LeaderboardController from '../controllers/LeaderboardController';
import { validateFields, validateToken } from '../middlewares/loginMiddleware';
import { validateTeams } from '../middlewares/matchMiddleware';

const loginRouter = Router();
const teamRouter = Router();
const matchRouter = Router();
const leaderboardRouter = Router();

const userController = new UserController();
const teamController = new TeamController();
const matchController = new MatchController();
const leaderboardController = new LeaderboardController();

loginRouter.post('/login', validateFields, userController.verify);
loginRouter.get('/login/validate', validateToken, userController.getRole);

teamRouter.get('/teams', teamController.getAll);
teamRouter.get('/teams/:id', teamController.getById);

matchRouter.get('/matches', matchController.getAll);
matchRouter.post('/matches', validateToken, validateTeams, matchController.matchInProgress);
matchRouter.patch('/matches/:id/finish', matchController.matchFinished);
matchRouter.patch('/matches/:id', matchController.matchUpdate);

leaderboardRouter.get('/leaderboard/home', leaderboardController.getHomeTeams);
leaderboardRouter.get('/leaderboard/away', leaderboardController.getAwayTeams);
leaderboardRouter.get('/leaderboard', leaderboardController.getAllTeams);

export {
  loginRouter,
  teamRouter,
  matchRouter,
  leaderboardRouter,
};
