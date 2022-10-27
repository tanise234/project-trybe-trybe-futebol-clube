import { Request, Response, NextFunction } from 'express';

const test = () => console.log('middleware accessed');

const validPassword = (password: string): boolean => {
  const minimumLimit = 6;
  return password.length > minimumLimit;
};

const validEmail = (email: string): boolean => {
  const format = /[A-Za-z0-9\\._-]+@[A-Za-z0-9]+\\..(\\.[A-Za-z]+)*/;
  return format.test(email);
};

const fisrtValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (!validPassword(password) || !validEmail(email)) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  next();
};

export { fisrtValidation, test };
