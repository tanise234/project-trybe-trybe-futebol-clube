import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import InvalidParamError from '../errors/invalid-param-error';
import { IData } from '../interfaces';

const secret = process.env.JWT_SECRET || ('jwt_secret' as jwt.Secret);

export default class TokenManager {
  static makeToken = (payload: unknown) => {
    const jwtConfig: jwt.SignOptions = {
      expiresIn: '1d',
      algorithm: 'HS256',
    };
    const token = jwt.sign({ data: payload }, secret, jwtConfig);
    return { token };
  };

  static checkToken = async (token: string) => {
    try {
      const result = jwt.decode(token);
      const { data } = result as IData;
      return data;
    } catch (error) {
      throw new InvalidParamError('Token must be a valid token');
    }
  };
}
