import { compareSync } from 'bcryptjs';
import { IUser } from '../interfaces';
import User from '../database/models/User';
import InvalidParamError from '../errors/invalid-param-error';
import TokenManager from '../utils/TokenManager';

export default class UserService {
  verify = async ({ email, password }: IUser) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new InvalidParamError('Incorrect email or password');
    }
    const passwordValid = compareSync(password, user.password);
    if (!passwordValid) {
      throw new InvalidParamError('Incorrect email or password');
    }

    const { id, role } = user;
    const token = TokenManager.makeToken({ email, id, role });
    return token;
  };
}
