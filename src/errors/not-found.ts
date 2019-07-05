export class NotFound extends Error {
  public constructor() {
    super('Record not found');
  }
}
