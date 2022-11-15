import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import TokenManager from '../utils/TokenManager';
import { IData } from '../interfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('Verifica se retorna status 400 e mensagem "All fields must be filled" caso:', () => {
    it('- o campo "email" não esteja preenchido', async ()=> {
      const response = { message: 'All fields must be filled'};
      const HTTPResponse = await chai.request(app).post('/login').send({ password: '123456'})
      expect(HTTPResponse.status).to.be.equal(400);
      expect(HTTPResponse.body).to.deep.equal(response);
    });

    it('- o campo "password" não esteja preenchido', async ()=> {
      const response = { message: 'All fields must be filled'};
      const HTTPResponse = await chai.request(app).post('/login').send({ email: 'admin@admin.com'})
      expect(HTTPResponse.status).to.be.equal(400);
      expect(HTTPResponse.body).to.deep.equal(response);
    });
  });

  describe('Verifica se retorna status 401 e mensagem "Incorrect email or password" caso:', ()=> {
    beforeEach(() => sinon.stub(bcrypt, 'compare').resolves(false))
    afterEach(() => sinon.restore())
    const response = { message: 'Incorrect email or password'};

    it('- o campo "email" esteja com formato incorreto', async () => {
      const HTTPResponse = await chai.request(app).post('/login').send({ email: 'error@error@com', password: 'secret_admin'})
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });

    it('- o campo "password" esteja com formato incorreto', async () => {
      const HTTPResponse = await chai.request(app).post('/login').send({ email: 'error@error.com', password: 'err'})
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });

    it('- o campo "email" esteja incorreto', async () => {
      sinon.stub(User, 'findOne').resolves(null)

      const HTTPResponse = await chai.request(app).post('/login').send({ email: 'error@error.com', password: 'secret_admin'})
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });

    it('- o campo "password" esteja incorreto', async () => {
      const user = { id: 1, username: 'error_user', email: 'email@mail.com', password: '123456' }
      sinon.stub(User, 'findOne').resolves(user as User)

      const HTTPResponse = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'error_password'})
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });
  });
});

describe('GET /login/validate', () => {
  describe('Verifica se retorna status 401 e mensagem "Token not found" caso:', () => {
    it('- o token não seja encontrado', async ()=> {
      const response = { message: 'Token not found'};
      const HTTPResponse = await chai.request(app).get('/login/validate').send({ email: 'admin@admin.com', password: 'error_password'})
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });
    it('- o usuária esteja incorreto', async ()=> {
      const data = { role: 1 }
      sinon.stub(TokenManager, 'checkToken').resolves(data)

      const response = { message: 'Token not found'};
      const HTTPResponse = await chai.request(app).get('/login/validate').send({ })
      expect(HTTPResponse.status).to.be.equal(401);
      expect(HTTPResponse.body).to.deep.equal(response);
    });
  });
});
