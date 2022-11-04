import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';

import * as bcrypt from 'bcryptjs';
import { app } from '../app';
import User from '../database/models/User';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Verififca o funcionamento do método POST na rota /login', () => {

    it('Verifica se retorna status 400 e mensagem "All fields must be filled" caso o campo "email" não esteja preenchido', async ()=> {
        const response = { message: 'All fields must be filled'};
        const HTTPResponse = await chai.request(app).post('/login').send({ password: '123456'})
        expect(HTTPResponse.status).to.be.equal(400);
        expect(HTTPResponse.body).to.deep.equal(response);
    });

    it('Verifica se retorna status 400 e mensagem "All fields must be filled" caso o campo "password" não esteja preenchido', async ()=> {
        const response = { message: 'All fields must be filled'};
        const HTTPResponse = await chai.request(app).post('/login').send({ email: 'admin@admin.com'})
        expect(HTTPResponse.status).to.be.equal(400);
        expect(HTTPResponse.body).to.deep.equal(response);
    });

    describe('Verifica se retorna status 401 e mensagem "Incorrect email or password" caso o campo "email" esteja incorreto', ()=> {
        before(() => sinon.stub(User, 'findOne').resolves(null))
        after(() => sinon.restore())
        it('Test', async () => {
            const response = { message: 'Incorrect email or password'};
            const HTTPResponse = await chai.request(app).post('/login').send({ email: 'error@error.com', password: 'secret_admin'})
            expect(HTTPResponse.status).to.be.equal(401);
            expect(HTTPResponse.body).to.deep.equal(response);
        });
    });

    describe('Verifica se retorna status 401 e mensagem "Incorrect email or password" caso o campo "password" esteja incorreto', ()=> {
        const user = { id: 1, username: 'error_user', email: 'email@mail.com', password: '123456' }
        const response = { message: 'Incorrect email or password'}

        before(() => sinon.stub(User, 'findOne').resolves(user as User))
        before(() => sinon.stub(bcrypt, 'compare').resolves(false))
        after(() => sinon.restore())

        it('Test', async () => {
            const response = { message: 'Incorrect email or password'};
            const HTTPResponse = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'error_password'})
            expect(HTTPResponse.status).to.be.equal(401);
            expect(HTTPResponse.body).to.deep.equal(response);
        });
    });
});
