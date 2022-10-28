export default class InvalidParamError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}
