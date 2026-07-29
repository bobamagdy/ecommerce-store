import { PLATFORM_ID } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HasPendingChanges, pendingChangesGuard } from './pending-changes-guard-guard';

describe('pendingChangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  function executeGuard(hasPendingChanges: boolean) {
    const component: HasPendingChanges = {
      hasPendingChanges: () => hasPendingChanges,
    };

    return TestBed.runInInjectionContext(() =>
      pendingChangesGuard(
        component,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  }

  it('should allow navigation when there are no pending changes', () => {
    const confirmSpy = vi.spyOn(window, 'confirm');

    const result = executeGuard(false);

    expect(result).toBe(true);

    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('should allow navigation when the user confirms leaving', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const result = executeGuard(true);

    expect(result).toBe(true);

    expect(confirmSpy).toHaveBeenCalledWith(
      'You have unsaved checkout information. Are you sure you want to leave?',
    );
  });

  it('should prevent navigation when the user cancels leaving', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    const result = executeGuard(true);

    expect(result).toBe(false);

    expect(confirmSpy).toHaveBeenCalledOnce();
  });
});
