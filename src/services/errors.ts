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

export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found.');
  }
}

export class MaxDistanceError extends Error {
  constructor() {
    super('Max distance reached.');
  }
}

export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of check-ins reached.');
  }
}

export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'The check-in can only be validated until 20 minutes of its creation.',
    );
  }
}
