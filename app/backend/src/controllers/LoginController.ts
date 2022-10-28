import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';

export default class LoginController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.verify(req.body);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
