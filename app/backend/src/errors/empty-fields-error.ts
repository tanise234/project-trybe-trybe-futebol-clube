export default class EmptyFieldsError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}
