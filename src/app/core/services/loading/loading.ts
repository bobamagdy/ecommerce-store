import {
  computed,
  Service,
  signal
} from '@angular/core';

@Service()
export class LoadingService {
  private readonly pendingRequestsState =
    signal(0);

  readonly pendingRequests =
    this.pendingRequestsState.asReadonly();

  readonly isLoading =
    computed(
      () =>
        this.pendingRequestsState() > 0
    );

  start(): void {
    this.pendingRequestsState.update(
      (currentCount) =>
        currentCount + 1
    );
  }

  stop(): void {
    this.pendingRequestsState.update(
      (currentCount) =>
        Math.max(
          currentCount - 1,
          0
        )
    );
  }

  reset(): void {
    this.pendingRequestsState.set(0);
  }
}