import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatchService {
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

  matchInProgress = async (
    homeTeam: number,
    homeTeamGoals: number,
    awayTeam: number,
    awayTeamGoals: number,
  ) => {
    const match = await Match.findOne({ where:
      { homeTeam, awayTeam },
    });
    if (match) await match.update({ homeTeamGoals, awayTeamGoals, inProgress: true });
    return match;
  };

  matchFinished = async (id: number) => {
    await Match.update({ inProgress: false }, { where: { id } });
  };
}
