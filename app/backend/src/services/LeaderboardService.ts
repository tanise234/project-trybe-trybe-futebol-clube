import { QueryTypes } from 'sequelize';
// import Team from '../database/models/Team';
// import Match from '../database/models/Match';
import TeamService from './TeamService';
import sequelizeModel from '../database/models';

const basicData = (target: string, opposite: string) =>
  `SELECT team_name AS name,
COUNT(*) AS totalGames,
SUM(${target}_team_goals > ${opposite}_team_goals) AS totalVictories,
SUM(${target}_team_goals = ${opposite}_team_goals) AS totalDraws,
SUM(${target}_team_goals < ${opposite}_team_goals) AS totalLosses,
SUM(${target}_team_goals) AS goalsFavor,
SUM(${opposite}_team_goals) AS goalsOwn,
SUM(${target}_team_goals - ${opposite}_team_goals) AS goalsBalance
FROM TRYBE_FUTEBOL_CLUBE.matches AS m
INNER JOIN TRYBE_FUTEBOL_CLUBE.teams AS t
ON m.${target}_team = t.id
WHERE m.in_progress = 0
GROUP BY m.${target}_team`;

const order = `ORDER BY
totalPoints DESC,
totalVictories DESC,
goalsBalance DESC,
goalsFavor DESC,
goalsOwn`;

const complexData = (basic: string) =>
  `SELECT *,
  (3 * totalVictories + totalDraws) AS totalPoints,
  ROUND(((3 * totalVictories + totalDraws) / (3 * totalGames)) * 100, 2) AS efficiency
  FROM (${basic}) AS basicBoard
  ${order}`;

export default class LeaderboardService {
  teamService: TeamService;
  modelSequelize;

  constructor() {
    this.teamService = new TeamService();
    this.modelSequelize = sequelizeModel;
  }

  getAll = async () => {
    const result = await this.modelSequelize.query(
      complexData(basicData('home', 'away')),
      { type: QueryTypes.SELECT },
    );
    return result;
  };
}
