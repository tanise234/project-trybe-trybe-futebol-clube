import { Request, Response, NextFunction } from 'express';
import { IData } from '../interfaces';
import InvalidParamError from '../errors/invalid-param-error';
import TokenManager from '../utils/TokenManager';
import EmptyFieldsError from '../errors/empty-fields-error';

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
    throw new EmptyFieldsError('All fields must be filled');
  }
  if (!validPassword(password) || !validEmail(email)) {
    throw new InvalidParamError('Incorrect email or password');
  }
  next();
};

const validateToken = async (req: IData, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new InvalidParamError('Token not found');
    }

    const user = await TokenManager.checkToken(authorization);
    if (!user) {
      throw new InvalidParamError('Token not found');
    }

    req.data = { role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export { validateFields, validateToken };
