import { Request, Response, NextFunction } from 'express';
import InvalidParamError from '../errors/invalid-param-error';
import TokenManager from '../utils/TokenManager';

const test = () => console.log('middleware accessed');

const validPassword = (password: string): boolean => {
  const minimumLimit = 6;
  return password.length > minimumLimit;
};

const validEmail = (email: string): boolean => {
  const format = /[A-Za-z0-9._-]+@[A-Za-z0-9]+..(.[A-Za-z]+)*/;
  return format.test(email);
};

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (!validPassword(password) || !validEmail(email)) {
    throw new InvalidParamError('Incorrect email or password');
  }
  next();
};

const validateToken = (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new InvalidParamError('Token not found');
  }

  const role = TokenManager.authenticateToken(authorization);
  console.log(role);
  return res.status(200).json({ role: `${role}` });
};

export { validateFields, validateToken };
