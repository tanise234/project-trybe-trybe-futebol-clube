import { QueryTypes } from 'sequelize';
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

const allTeamsBasicData = () =>
  `SELECT name,
  SUM(totalGames) AS totalGames,
  SUM(totalVictories) AS totalVictories,
  SUM(totalDraws) AS totalDraws,
  SUM(totalLosses) AS totalLosses,
  SUM(goalsFavor) AS goalsFavor,
  SUM(goalsOwn) AS goalsOwn,
  SUM(goalsBalance) goalsBalance
  FROM ((${basicData('home', 'away')}) UNION (${basicData('away', 'home')})) AS allTeamsBasicBoard
  GROUP BY name`;

const order = `ORDER BY
  totalPoints DESC,
  totalVictories DESC,
  goalsBalance DESC,
  goalsFavor DESC,
  goalsOwn DESC`;

const complexData = (basic: string) =>
  `SELECT *,
  (3 * totalVictories + totalDraws) AS totalPoints,
  ROUND(((3 * totalVictories + totalDraws) / (3 * totalGames)) * 100, 2) AS efficiency
  FROM (${basic}) AS basicBoard
  ${order}`;

export default class LeaderboardService {
  modelSequelize;

  constructor() {
    this.modelSequelize = sequelizeModel;
  }

  getAll = async (...teams: string[]) => {
    if (teams.length === 0) {
      const result = await this.modelSequelize.query(
        complexData(allTeamsBasicData()),
        { type: QueryTypes.SELECT },
      );
      return result;
    }
    const result = await this.modelSequelize.query(
      complexData(basicData(teams[0], teams[1])),
      { type: QueryTypes.SELECT },
    );
    return result;
  };
}
