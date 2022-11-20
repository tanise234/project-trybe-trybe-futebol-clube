import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class TeamController {
  leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  getHomeTeams = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getAll('home', 'away');
      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  };

  getAwayTeams = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getAll('away', 'home');
      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  };

  getAllTeams = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getAll();
      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  };
}
