import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../../../core/services/auth/auth';

import { AdminLayout } from './admin-layout';

describe('AdminLayout', () => {
  let component: AdminLayout;

  let fixture: ComponentFixture<AdminLayout>;

  let router: Router;

  const logoutMock = vi.fn();

  beforeEach(async () => {
    logoutMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [AdminLayout],

      providers: [
        provideZonelessChangeDetection(),

        provideRouter([]),

        {
          provide: AuthService,

          useValue: {
            logout: logoutMock,
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AdminLayout);

    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the admin navigation', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('Dashboard');

    expect(hostElement.textContent).toContain('Products');

    expect(hostElement.textContent).toContain('Orders');
  });

  it('should toggle and close the sidebar', () => {
    expect(component.sidebarOpen()).toBe(false);

    component.toggleSidebar();

    expect(component.sidebarOpen()).toBe(true);

    component.closeSidebar();

    expect(component.sidebarOpen()).toBe(false);
  });

  it('should logout and navigate to login', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    await component.logout();

    expect(logoutMock).toHaveBeenCalledOnce();

    expect(navigateSpy).toHaveBeenCalledWith('/auth/login');
  });
});
