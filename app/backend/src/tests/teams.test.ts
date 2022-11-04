import * as sinon from 'sinon';
import * as chai from 'chai';

import teams from './teamsMock';
// @ts-ignore
import chaiHttp = require('chai-http');
import Team from '../database/models/Team';
import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;
interface ITeam {
    id?: number,
    temaName: string,
};

describe('GET /teams', () => {
  afterEach(function () {
    sinon.restore();
    });


    describe('Teste caso requisição get na rota /teams seja feita com sucesso',()=> {
        it('Deve retornar um status 200 e uma lista de times', async () => {
          sinon.stub(Team, 'findAll').resolves(teams as any[])
          const HTTPResponse = await chai.request(app).get('/teams')
          expect(HTTPResponse.status).to.be.equal(200);
          expect(HTTPResponse.body).to.be.deep.equal(teams)
        });
      });
    
      describe('Teste caso requisição get na rota /teams/:id seja feita com sucesso', ()=> {
        it('Deve retornar um status 200 e um time', async () => {
          const team = teams[0];
          sinon.stub(Team, 'findOne').resolves(team as any)
          const HTTPResponse = await chai.request(app).get('/teams/1')
          expect(HTTPResponse.status).to.be.equal(200);
          expect(HTTPResponse.body).to.be.deep.equal(teams[0]);
        });
      });
  });
