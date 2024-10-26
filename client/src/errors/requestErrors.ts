export class BadParametersError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "BadParametersError";
  }
}
