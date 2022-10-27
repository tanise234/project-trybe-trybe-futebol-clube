import { Router } from 'express';
import { fisrtValidation } from '../middlewares/loginMiddleware';

const loginRouter = Router();
const matchRouter = Router();

loginRouter.post('/login', fisrtValidation);

export {
  loginRouter,
  matchRouter,
};
