import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class TeamController {
  leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  getAll = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getAll();
      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  };

  // getAllHome = async (req:Request, res: Response, next: NextFunction) => {
  //   try {
  //     const leaderboard = await this.leaderboardService.getAllHome();
  //     return res.status(200).json(leaderboard);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // getAllAway = async (req:Request, res: Response, next: NextFunction) => {
  //   try {
  //     const leaderboard = await this.leaderboardService.getAllAway();
  //     return res.status(200).json(leaderboard);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
