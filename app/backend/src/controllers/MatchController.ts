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

  matchInProgress = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;
      const match = await this.matchService
        .matchInProgress(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);
      return res.status(201).json(match);
    } catch (error) {
      next(error);
    }
  };

  matchFinished = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.matchService
        .matchFinished(Number(id));
      return res.status(200).json({ message: 'Finished' });
    } catch (error) {
      next(error);
    }
  };
}
