import Team from '../database/models/Team';

export default class TeamService {
  getAll = async () => {
    const teams = await Team.findAll();
    return teams;
  };
}
