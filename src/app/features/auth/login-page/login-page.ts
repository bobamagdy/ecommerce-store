import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-login-page',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule
  ],

  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
private readonly authService =
  inject(AuthService);

private readonly router =
  inject(Router);

private readonly route =
  inject(ActivatedRoute);
  readonly submitted = signal(false);
  readonly passwordVisible = signal(false);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    rememberMe: [false]
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (currentValue) => !currentValue
    );
  }

  submit(): void {
  this.submitted.set(true);
  this.loginForm.markAllAsTouched();

  if (this.loginForm.invalid) {
    return;
  }

  const loginRequest =
    this.loginForm.getRawValue();

  this.authService.login(
    loginRequest.rememberMe
  );

  const returnUrl =
    this.route.snapshot.queryParamMap.get(
      'returnUrl'
    ) ?? '/';

  this.router.navigateByUrl(returnUrl);
}
}