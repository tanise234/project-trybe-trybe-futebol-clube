import { Router } from 'express';
import { validate } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const matchRouter = Router();

loginRouter.post('/login', validate);

export {
  loginRouter,
  matchRouter,
};
