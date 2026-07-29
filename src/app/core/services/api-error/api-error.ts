import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  Service,
  signal
} from '@angular/core';

@Service()
export class ApiErrorService {
  private readonly messageState =
    signal<string | null>(null);

  readonly message =
    this.messageState.asReadonly();

  report(
    error: HttpErrorResponse
  ): void {
    this.messageState.set(
      this.resolveMessage(error)
    );
  }

  clear(): void {
    this.messageState.set(null);
  }

  private resolveMessage(
    error: HttpErrorResponse
  ): string {
    const backendMessage =
      this.readBackendMessage(
        error.error
      );

    if (backendMessage) {
      return backendMessage;
    }

    switch (error.status) {
      case 0:
        return (
          'Unable to connect to the server. ' +
          'Check your internet connection.'
        );

      case 400:
        return (
          'The submitted request is invalid.'
        );

      case 401:
        return (
          'Your session has expired. ' +
          'Please sign in again.'
        );

      case 403:
        return (
          'You do not have permission ' +
          'to perform this action.'
        );

      case 404:
        return (
          'The requested resource could not be found.'
        );

      case 409:
        return (
          'The request conflicts with existing data.'
        );

      case 422:
        return (
          'Some submitted information is invalid.'
        );

      case 500:
        return (
          'A server error occurred. ' +
          'Please try again later.'
        );

      default:
        return (
          error.message ||
          'An unexpected error occurred.'
        );
    }
  }

  private readBackendMessage(
    errorBody: unknown
  ): string | null {
    if (
      typeof errorBody !== 'object' ||
      errorBody === null
    ) {
      return null;
    }

    const possibleMessage =
      (
        errorBody as Record<
          string,
          unknown
        >
      )['message'];

    if (
      typeof possibleMessage !==
        'string'
    ) {
      return null;
    }

    const trimmedMessage =
      possibleMessage.trim();

    return trimmedMessage.length > 0
      ? trimmedMessage
      : null;
  }
}