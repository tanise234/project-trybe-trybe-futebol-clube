import { NextFunction, Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  getAll = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const teams = await this.teamService.getAll();
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getById(Number(id));
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  };
}
