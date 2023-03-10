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
import Team from '../database/models/Team';

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
    afterEach(() => sinon.restore());
    it('- homeTeam e awayTeam sejam o mesmo time', async ()=> {
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

  describe('Verifica se retorna status 404 e mensagem "There is no team with such id!" caso:', () => {
    afterEach(() => sinon.restore());
    it('- homeTeam e/ou awayTeam não existam', async ()=> {
      sinon.stub(Team, 'findOne').resolves(null);
      sinon.stub(TokenManager, 'checkToken').returns({ role: 1 });
      const body = {
        "homeTeam": 999,
        "awayTeam": 9999,
        "homeTeamGoals": 0,
        "awayTeamGoals": 0
      };

      const HTTPResponse = await chai.request(app).post('/matches').set('authorization', 'validToken').send(body);
      expect(HTTPResponse.status).to.be.equal(404);
      expect(HTTPResponse.body).to.deep.equal({message: 'There is no team with such id!'});
    });
  });

  describe('Verifica se retorna status 201 e mensagem "There is no team with such id!" caso:', () => {
    afterEach(() => sinon.restore());
    it('- homeTeam e awayTeam existam', async ()=> {
      const match = {
        "id": 1,
        "homeTeam": 1,
        "awayTeam": 2,
        "homeTeamGoals": 3,
        "awayTeamGoals": 4
      };
      sinon.stub(Match, 'create').resolves(match as IMatch[] | any);
      sinon.stub(TokenManager, 'checkToken').returns({ role: 1 });
      const body = {
        "homeTeam": 1,
        "awayTeam": 2,
        "homeTeamGoals": 3,
        "awayTeamGoals": 4,
        "inProgress": true
      };

      const HTTPResponse = await chai.request(app).post('/matches').set('authorization', 'validToken').send(body);
      expect(HTTPResponse.status).to.be.equal(201);
      expect(HTTPResponse.body).to.deep.equal(match);
    });
  });

});

describe('PATCH /matches/:id/finish', () => {
  describe('Verifica se retorna status 200 e mensagem "Finished" caso:', () => {
    afterEach(() => sinon.restore());
    it('- mude o status da partida para finalizada', async ()=> {
      sinon.stub(Match, 'update').resolves([1] as any);
      
      const HTTPResponse = await chai.request(app).patch('/matches/1/finish');
      expect(HTTPResponse.status).to.be.equal(200);
      expect(HTTPResponse.body).to.deep.equal({ message: 'Finished' });
    });
  });
});
describe('PATCH /matches/:id', () => {
  describe('Verifica se retorna status 200 e a partida atualizada" caso:', () => {
    afterEach(() => sinon.restore());
    it('- mude o status da partida para não finalizada', async ()=> {
      const body = {
        "homeTeamGoals": 1,
        "awayTeamGoals": 2
      }
      sinon.stub(Match, 'update').resolves([1] as any);
      
      const HTTPResponse = await chai.request(app).patch('/matches/1').send(body);
      expect(HTTPResponse.status).to.be.equal(200);
      expect(HTTPResponse.body).to.deep.equal([1]);
    });
  });
});
