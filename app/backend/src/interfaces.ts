import { Request } from 'express';

export interface IUser {
  id?: number
  username: string
  role: string
  email: string
  password: string
}

export interface IUserService {
  verify (user: IUser): Promise<any>
}

export interface IData extends Request {
  data?: {
    id?: number;
    username?: string;
    role: number;
    email?: string;
    password?: string;
  }
}

export interface ITeam {
  id?: number;
  teamName: string;
}

export interface IMatch {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: number;
}
