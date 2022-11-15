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


    describe('Verifica se retorna status 200 em caso de sucesso:',()=> {
      it('- e retorna uma lista de times na rota /teams', async () => {
        const HTTPResponse = await chai.request(app).get('/teams')
        expect(HTTPResponse.status).to.be.equal(200);
        expect(HTTPResponse.body).to.be.deep.equal(teams)
      });
      
      it('- e retorna um time na rota /teams/:id', async () => {
        const HTTPResponse = await chai.request(app).get('/teams/1')
        expect(HTTPResponse.status).to.be.equal(200);
        expect(HTTPResponse.body).to.be.deep.equal(teams[0]);
      });
    });
  });
