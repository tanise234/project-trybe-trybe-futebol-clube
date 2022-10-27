import { Request, Response, NextFunction } from 'express';

const test = () => console.log('middleware accessed');

const validate = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (!email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  next();
};

export { validate, test };
