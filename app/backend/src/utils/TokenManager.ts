import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import InvalidParamError from '../errors/invalid-param-error';

const secret = process.env.JWT_SECRET || ('jwt_secret' as jwt.Secret);

export default class TokenManager {
  static makeToken = (payload: unknown) => {
    const jwtConfig: jwt.SignOptions = {
      expiresIn: '1d',
      algorithm: 'HS256',
    };
    const token = jwt.sign({ data: payload }, secret, jwtConfig);
    return token;
  };

  static authenticateToken = async (token: string | undefined) => {
    if (!token) {
      throw new InvalidParamError('Token not found');
    }

    try {
      const validateToken = jwt.verify(token, secret);
      return validateToken;
    } catch (error) {
      throw new InvalidParamError('Expired or invalid token');
    }
  };
}
