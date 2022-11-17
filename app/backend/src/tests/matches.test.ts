import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import Match from '../database/models/Match';

import { Response } from 'superagent';
import { IData, IMatch } from '../interfaces';
import { allMatches, macthesInProgressFalse, matchesInProgressTrue } from "./matchesMock";
import TokenManager from '../utils/TokenManager';
import { validateTeams } from '../middlewares/matchMiddleware';
import { NextFunction } from 'express';
import { validateToken } from '../middlewares/loginMiddleware';
import { JsonWebTokenError } from 'jsonwebtoken';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matches', () => {
  describe('Verifica se retorna status 200 e:', () => {
    afterEach(() => sinon.restore());
    it('- todas as partidas, caso não haja filtro', async ()=> {
      sinon.stub(Match, 'findAll').resolves(allMatches as IMatch[] | any);

      const HTTPResponse = await chai.request(app).get('/matches');
      expect(HTTPResponse.status).to.be.equal(200);
      expect(HTTPResponse.body).to.deep.equal(allMatches);
    });

    it('- somente as partidas finalizadas, conforme o filtro inProgress', async ()=> {
      sinon.stub(Match, 'findAll').resolves(macthesInProgressFalse as IMatch[] | any);

      const HTTPResponse = await chai.request(app).get('/matches?inProgress=false');
      expect(HTTPResponse.status).to.be.equal(200);
      expect(HTTPResponse.body).to.deep.equal(macthesInProgressFalse);
    });

    it('- somente as partidas não finalizadas, conforme o filtro inProgress', async ()=> {
      sinon.stub(Match, 'findAll').resolves(matchesInProgressTrue as IMatch[] | any);

      const HTTPResponse = await chai.request(app).get('/matches?inProgress=true');
      expect(HTTPResponse.status).to.be.equal(200);
      expect(HTTPResponse.body).to.deep.equal(matchesInProgressTrue);
    });
  });
});

describe('POST /matches', () => {
  describe('Verifica se retorna status 401 e mensagem "Token not found" caso:', () => {
    afterEach(() => sinon.restore());
    it('- o token não seja encontrado', async ()=> {
      const HTTPResponse = await chai.request(app).post('/matches');
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal({message: 'Token not found'});
    });
    it('- o token não seja válido', async ()=> {
      sinon.stub(TokenManager, 'checkToken').returns(undefined);

      const HTTPResponse = await chai.request(app).post('/matches').set('authorization', 'any_token');
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal({message: 'Token not found'});
    });
  });

  describe('Verifica se retorna status 422 e mensagem "It is not possible to create a match with two equal teams" caso:', () => {
    it('- homeTeam e awayTeam sejam o mesmo time', async ()=> {
      sinon.stub(Match, "create").resolves(allMatches[0] as IMatch[] | any);
      sinon.stub(TokenManager, 'checkToken').returns({ role: 1 });
      const body = {
        "homeTeam": 5,
        "awayTeam": 5,
        "homeTeamGoals": 0,
        "awayTeamGoals": 0
      };

      const HTTPResponse = await chai.request(app).post('/matches').set('authorization', 'validToken').send(body);
      expect(HTTPResponse.status).to.be.equal(422);
      expect(HTTPResponse.body).to.deep.equal({message: 'It is not possible to create a match with two equal teams'});
    });
  });
});

describe('PATCH /matches/:id/finish', () => {
  describe('Verifica se retorna status 401 e mensagem "Token not found" caso:', () => {
    it('- o token não seja encontrado', async ()=> {
      
    });
  });
});
describe('PATCH /matches/:id', () => {
  describe('Verifica se retorna status 401 e mensagem "Token not found" caso:', () => {
    it('- o token não seja encontrado', async ()=> {
      
    });
  });
});
