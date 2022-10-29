import Team from '../database/models/Team';

export default class TeamService {
  getAll = async () => {
    const teams = await Team.findAll();
    return teams;
  };

  getById = async (id: number) => {
    const team = await Team.findOne({ where: { id } });
    return team;
  };
}
