import { NextFunction, Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  getAll = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const matches = await this.matchService.getAll();
      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  // getByQuery = async (req:Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { id } = req.query;
  //     const team = await this.matchService.getByQuery(Number(id));
  //     return res.status(200).json(team);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
