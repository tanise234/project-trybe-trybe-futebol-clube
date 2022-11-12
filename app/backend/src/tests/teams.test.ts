import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import Team from '../database/models/Team';
import teams from './teamsMock';
import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {
    const team = teams[0];

    beforeEach(async () => {
        sinon
          .stub(Team, "findAll")
          .resolves(teams as any);
        sinon
          .stub(Team, "findOne")
          .resolves(team as any);
      });
    
      afterEach(()=>{
        sinon.restore()
      })


    describe('Teste caso requisição get na rota /teams seja feita com sucesso',()=> {
        it('Deve retornar um status 200 e uma lista de times', async () => {
          const HTTPResponse = await chai.request(app).get('/teams')
          expect(HTTPResponse.status).to.be.equal(200);
          expect(HTTPResponse.body).to.be.deep.equal(teams)
        });
      });
    
      describe('Teste caso requisição get na rota /teams/:id seja feita com sucesso', ()=> {
        it('Deve retornar um status 200 e um time', async () => {
          const HTTPResponse = await chai.request(app).get('/teams/1')
          expect(HTTPResponse.status).to.be.equal(200);
          expect(HTTPResponse.body).to.be.deep.equal(teams[0]);
        });
      });
  });
