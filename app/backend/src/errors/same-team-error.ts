export default class SameTeamError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 422;
  }
}
