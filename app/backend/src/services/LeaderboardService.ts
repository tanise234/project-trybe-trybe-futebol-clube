import sequelize = require('sequelize');
import Team from '../database/models/Team';
import Match from '../database/models/Match';
// import NotFoundError from '../errors/not-found-error';
import TeamService from './TeamService';

export default class LeaderboardService {
  teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  gamesInfo = async () => {
    const info = await Match.findAll({
      where: { inProgress: false },
      attributes: ['homeTeam',
        [sequelize.fn('count', sequelize.col('home_team')), 'totalGames'],
        [sequelize.fn('sum', sequelize
          .literal('home_team_goals > away_team_goals')), 'totalVictories'],
        [sequelize.fn('sum', sequelize
          .literal('home_team_goals = away_team_goals')), 'totalDraws'],
        [sequelize.fn('sum', sequelize
          .literal('home_team_goals < away_team_goals')), 'totalLosses'],
      ],
      group: ['homeTeam'],
      raw: true,
    });
    return info;
  };

  getAll = async () => {
    const info = await Match.findAll({
      where: { inProgress: false },
      attributes: ['homeTeam',
        [sequelize.fn('sum', sequelize.col('home_team_goals')), 'goalsFavor'],
        [sequelize.fn('sum', sequelize.col('away_team_goals')), 'goalsOwn'],
        [sequelize.fn('sum', sequelize
          .literal('home_team_goals - away_team_goals')), 'goalsBalance'],
      ],
      group: ['homeTeam'],
    });
    return info;
  };

  getAllj = async () => {
    const info = await Match.findAll({
      where: { inProgress: false },
      order: [['homeTeam', 'DESC']],
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
      ],
      attributes: ['homeTeam',
        [sequelize.fn('sum', sequelize.col('home_team_goals')), 'goalsFavor'],
        [sequelize.fn('sum', sequelize.col('away_team_goals')), 'goalsOwn'],
        [sequelize.fn('sum', sequelize
          .literal('home_team_goals - away_team_goals')), 'goalsBalance'],
      ],
      group: ['homeTeam'],
    });
    return info;
  };
}
