import type { ValidationErrorEntry } from './types';

// TODO: Log the error to Google Stackdriver, Rollbar etc.
function report(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

export class ValidationError extends Error {
  code = 400;
  state: any;

  constructor(errors: Array<ValidationErrorEntry>) {
    super('The request is invalid.');
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true
        });
      }
      return result;
    }, {});
  }
}

export class UnauthorizedError extends Error {
  code = 401;
  message = this.message || 'Anonymous access is denied.';
}

export class ForbiddenError extends Error {
  code = 403;
  message = this.message || 'Access is denied.';
}

export default { report };
