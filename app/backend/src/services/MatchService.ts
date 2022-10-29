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

  // getByQuery = async (id: number) => {
  //   const match = await Match.findOne({ where: { id } });
  //   return match;
  // };
}
