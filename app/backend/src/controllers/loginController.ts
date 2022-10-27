// import { Request, Response } from 'express';

export interface Ilogin {
  email: string
  password: string
}

export class loginController {
  login: Ilogin;

  constructor(login: Ilogin) {
    this.login = login;
  }

  protected get email() : string {
    return this.login.email;
  }

  protected get password() : string {
    return this.login.password;
  }
}
