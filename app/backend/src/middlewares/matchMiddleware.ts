import { Request, Response, NextFunction } from 'express';
import SameTeamError from '../errors/same-team-error';

const validateTeams = (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    throw new SameTeamError('It is not possible to create a match with two equal teams');
  }
  next();
};

const test = () => {};

export { validateTeams, test };
