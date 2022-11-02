import Team from '../database/models/Team';
import Match from '../database/models/Match';
import NotFoundError from '../errors/not-found-error';
import TeamService from './TeamService';

export default class MatchService {
  teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  getAll = async () => {
    const matches = await Match.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return matches;
  };

  getAllByProgress = async (status: string) => {
    const inProgress = JSON.parse(status);
    const matches = await Match.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
      where: { inProgress },
    });
    return matches;
  };

  teamExist = async (id: number) => {
    const exist = await this.teamService.getById(id);
    if (!exist) {
      throw new NotFoundError('There is no team with such id!');
    }
  };

  matchInProgress = async (
    homeTeam: number,
    homeTeamGoals: number,
    awayTeam: number,
    awayTeamGoals: number,
  ) => {
    await this.teamExist(homeTeam);
    await this.teamExist(awayTeam);

    const match = await Match.findOne({ where:
      { homeTeam, awayTeam },
    });
    if (match) await match.update({ homeTeamGoals, awayTeamGoals, inProgress: true });
    return match;
  };

  matchFinished = async (id: number) => {
    await Match.update({ inProgress: false }, { where: { id } });
  };

  matchUpdate = async (id: number, homeTeamGoals: number, awayTeamGoals: number) => {
    const result = await Match.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return result;
  };
}
