import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const passwordsMatchValidator: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  const password =
    form.get('password')?.value;

  const confirmPassword =
    form.get('confirmPassword')?.value;

  return password === confirmPassword
    ? null
    : {
        passwordMismatch: true
      };
};

@Component({
  selector: 'app-register-page',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule
  ],

  templateUrl: './register-page.html',
  styleUrl: './register-page.scss'
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly submitted = signal(false);

  readonly passwordVisible = signal(false);

  readonly confirmPasswordVisible = signal(false);

  readonly registerForm =
    this.formBuilder.nonNullable.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ],

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
            Validators.minLength(8),

            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
            )
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ],

        acceptTerms: [
          false,
          [
            Validators.requiredTrue
          ]
        ]
      },
      {
        validators: passwordsMatchValidator
      }
    );

  get firstName() {
    return this.registerForm.controls.firstName;
  }

  get lastName() {
    return this.registerForm.controls.lastName;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  get acceptTerms() {
    return this.registerForm.controls.acceptTerms;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (currentValue) => !currentValue
    );
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update(
      (currentValue) => !currentValue
    );
  }

  submit(): void {
    this.submitted.set(true);
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    const registerRequest =
      this.registerForm.getRawValue();

    console.log(
      'Register request:',
      registerRequest
    );
  }
}