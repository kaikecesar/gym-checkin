export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists.');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials.');
  }
}

export class ResourceNotFound extends Error {
  constructor() {
    super('Resource not found.');
  }
}
