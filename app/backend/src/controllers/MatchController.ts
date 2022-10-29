import { NextFunction, Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  getAll = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.inProgress;
      let matches;
      if (status) {
        matches = await this.matchService.getAllByProgress(status as string);
      } else {
        matches = await this.matchService.getAll();
      }

      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };
}
